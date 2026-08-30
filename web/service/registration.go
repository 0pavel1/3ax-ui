package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/coinman-dev/3ax-ui/v2/database"
	"github.com/coinman-dev/3ax-ui/v2/database/model"
	"github.com/coinman-dev/3ax-ui/v2/logger"
	"github.com/coinman-dev/3ax-ui/v2/util/random"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SavePendingRegistration creates or updates a pending registration in the database.
func SavePendingRegistration(reg *model.PendingRegistration) error {
	db := database.GetDB()
	var existing model.PendingRegistration
	err := db.Where("tg_id = ?", reg.TgID).First(&existing).Error
	nowTs := time.Now().UnixMilli()

	if errors.Is(err, gorm.ErrRecordNotFound) {
		reg.CreatedAt = nowTs
		reg.UpdatedAt = nowTs
		return db.Create(reg).Error
	} else if err != nil {
		return err
	}

	existing.ChatID = reg.ChatID
	existing.Username = reg.Username
	existing.FirstName = reg.FirstName
	existing.LastName = reg.LastName
	existing.Slug = reg.Slug
	existing.Status = reg.Status
	existing.UpdatedAt = nowTs
	return db.Save(&existing).Error
}

// GetPendingRegistration loads a registration by telegram ID.
func GetPendingRegistration(tgId int64) (*model.PendingRegistration, error) {
	db := database.GetDB()
	var reg model.PendingRegistration
	if err := db.Where("tg_id = ?", tgId).First(&reg).Error; err != nil {
		return nil, err
	}
	return &reg, nil
}

// HasPendingApplication reports whether a user has an active pending registration.
func HasPendingApplication(tgId int64) bool {
	db := database.GetDB()
	var count int64
	db.Model(&model.PendingRegistration{}).Where("tg_id = ? AND status = ?", tgId, model.RegPending).Count(&count)
	return count > 0
}

// GetAllPendingRegistrations returns all registrations currently in pending status.
func GetAllPendingRegistrations() ([]model.PendingRegistration, error) {
	db := database.GetDB()
	var regs []model.PendingRegistration
	if err := db.Where("status = ?", model.RegPending).Order("created_at asc").Find(&regs).Error; err != nil {
		return nil, err
	}
	return regs, nil
}

// UpdateRegistrationStatus updates status for a registration.
func UpdateRegistrationStatus(tgId int64, status model.RegistrationStatus) error {
	db := database.GetDB()
	nowTs := time.Now().UnixMilli()
	return db.Model(&model.PendingRegistration{}).Where("tg_id = ?", tgId).Updates(map[string]any{
		"status":     status,
		"updated_at": nowTs,
	}).Error
}

// IsAwgInbound reports whether an inbound is a WireGuard/AmneziaWG tunnel or proxy.
func IsAwgInbound(inbound *model.Inbound) bool {
	if inbound == nil {
		return false
	}
	proto := strings.ToLower(string(inbound.Protocol))
	remark := strings.ToLower(inbound.Remark)
	return proto == "tunnel" || proto == "wireguard" || proto == "amneziawg" || proto == "nativewg" || proto == "mixed" || proto == "http" ||
		strings.Contains(proto, "awg") || strings.Contains(proto, "wg") ||
		strings.Contains(remark, "awg") || strings.Contains(remark, "amnezia") || strings.Contains(remark, "wireguard")
}

// RegisterUserInbounds provisions a user across all active Xray inbounds (except excluded) and AWG.
func RegisterUserInbounds(reg *model.PendingRegistration, excludeIds []int, inboundService *InboundService, awgService *AwgService) (int, error) {
	if reg == nil || reg.Slug == "" {
		return 0, errors.New("invalid registration data")
	}

	excludeMap := make(map[int]bool)
	for _, id := range excludeIds {
		excludeMap[id] = true
	}

	subId := random.Seq(16)
	createdCount := 0

	// 1. Provision Xray inbounds
	inbounds, err := inboundService.GetAllInbounds()
	if err == nil {
		for _, inbound := range inbounds {
			if !inbound.Enable || excludeMap[inbound.Id] || IsAwgInbound(inbound) {
				continue
			}

			email := fmt.Sprintf("%s_%d", reg.Slug, inbound.Id)
			clientJSON, err := buildClientJSONForInbound(inbound, email, reg.TgID, subId)
			if err != nil {
				logger.Warningf("Failed to build client JSON for inbound %d (%s): %v", inbound.Id, inbound.Remark, err)
				continue
			}

			newInbound := &model.Inbound{
				Id:       inbound.Id,
				Settings: clientJSON,
			}

			_, err = inboundService.AddInboundClient(newInbound)
			if err != nil {
				logger.Warningf("Failed to add client %s to inbound %d: %v", email, inbound.Id, err)
				continue
			}
			createdCount++
		}
	} else {
		logger.Errorf("GetAllInbounds failed during registration: %v", err)
	}

	// 2. Provision AWG (AmneziaWG)
	if awgService != nil {
		awgServer, err := awgService.GetServer()
		if err == nil && awgServer != nil && awgServer.Enable {
			// Find next AWG index for this user
			existingClients, _ := awgService.GetClients()
			prefix := reg.Slug + "_awg_"
			maxIdx := 0
			for _, c := range existingClients {
				if strings.HasPrefix(c.Email, prefix) {
					var idx int
					if _, scanErr := fmt.Sscanf(c.Email, prefix+"%d", &idx); scanErr == nil && idx > maxIdx {
						maxIdx = idx
					}
				}
			}
			awgEmail := fmt.Sprintf("%s_awg_%d", reg.Slug, maxIdx+1)

			tunnelClient := &model.TunnelClient{
				Email:   awgEmail,
				TgId:    reg.TgID,
				Enable:  true,
				TotalGB: 0,
			}

			if err := awgService.AddClient(tunnelClient); err != nil {
				logger.Warningf("Failed to add AWG client %s: %v", awgEmail, err)
			} else {
				createdCount++
			}
		}
	}

	return createdCount, nil
}

func buildClientJSONForInbound(inbound *model.Inbound, email string, tgId int64, subId string) (string, error) {
	uid := uuid.NewString()
	cred := strings.ReplaceAll(uuid.NewString(), "-", "")

	client := model.Client{
		Email:      email,
		TgID:       tgId,
		SubID:      subId,
		Enable:     true,
		LimitIP:    0,
		TotalGB:    0,
		ExpiryTime: 0,
		Reset:      0,
	}

	switch inbound.Protocol {
	case model.VMESS:
		client.ID = uid
		client.Security = "auto"

	case model.VLESS:
		client.ID = uid
		if inbound.StreamSettings != "" {
			var stream map[string]any
			if json.Unmarshal([]byte(inbound.StreamSettings), &stream) == nil {
				net, _ := stream["network"].(string)
				sec, _ := stream["security"].(string)
				// xtls-rprx-vision is only valid for direct TCP transport (reality / tls).
				// For xhttp, ws, grpc, httpupgrade etc., flow must be empty.
				if net == "tcp" && (sec == "reality" || sec == "tls") {
					client.Flow = "xtls-rprx-vision"
				}
			}
		}

	case model.Trojan:
		client.Password = cred

	case model.Shadowsocks:
		client.Password = cred
		client.Security = "aes-128-gcm"
		if inbound.Settings != "" {
			var s map[string]any
			if json.Unmarshal([]byte(inbound.Settings), &s) == nil {
				if m, ok := s["method"].(string); ok && m != "" {
					client.Security = m
				}
			}
		}

	case model.Hysteria:
		client.Auth = cred

	default:
		client.ID = uid
	}

	m := map[string]any{
		"clients": []model.Client{client},
	}
	b, err := json.Marshal(m)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
