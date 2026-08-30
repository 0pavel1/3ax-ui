package model

type RegistrationStatus string

const (
	RegPending  RegistrationStatus = "pending"
	RegApproved RegistrationStatus = "approved"
	RegRejected RegistrationStatus = "rejected"
)

type PendingRegistration struct {
	ID        int                `gorm:"primaryKey;autoIncrement" json:"id"`
	TgID      int64              `gorm:"uniqueIndex;column:tg_id" json:"tgId"`
	ChatID    int64              `gorm:"column:chat_id" json:"chatId"`
	Username  string             `gorm:"column:username" json:"username"`
	FirstName string             `gorm:"column:first_name" json:"firstName"`
	LastName  string             `gorm:"column:last_name" json:"lastName"`
	Slug      string             `gorm:"column:slug" json:"slug"`
	Status    RegistrationStatus `gorm:"column:status;default:'pending'" json:"status"`
	CreatedAt int64              `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt int64              `gorm:"column:updated_at" json:"updatedAt"`
}

func (PendingRegistration) TableName() string {
	return "pending_registrations"
}
