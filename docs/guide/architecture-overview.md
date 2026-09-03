---
title: Системная архитектура
description: Глобальная архитектура 3AX-UI, C4-модель контейнеров и взаимосвязь подсистем
---

# Системная архитектура 3AX-UI

Панель **3AX-UI** представляет собой высокопроизводительный серверный комплекс для централизованного управления прокси-протоколами и VPN-туннелями с глубокой интеграцией в ядро Linux.

Комплекс объединяет движок **Xray-Core**, модуль ядра **AmneziaWG** (версии 1.x–3.1) и **Native WireGuard**, сайдкары **MTProto Proxy** (`mtg` / `mtg-multi`), независимый dual-stack сервер подписок, систему Telegram-онбординга и REST API.

---

## 1. Архитектурная модель C4 (Container Diagram)

Ниже представлена глобальная диаграмма взаимодействия процессов и компонентов операционной системы:

```mermaid
flowchart TB
    subgraph Clients["Клиенты и потребители"]
        Browser["Веб-браузер (Администратор)"]
        TgUser["Пользователь Telegram"]
        SubClient["VPN/Proxy Клиенты (V2RayN, Sing-box, Clash, Mihomo, AmneziaVPN)"]
    end

    subgraph Host["Хост-система (Linux)"]
        subgraph Daemon["Процесс 3AX-UI (Golang)"]
            Main["Точка входа main.go<br/>Рантайм, сигналы (SIGHUP, SIGUSR1, SIGTERM)"]
            WebServer["Gin Web-сервер (REST API, Web UI, WebSocket)"]
            SubServer["Sub Server (Dual-stack IPv4/IPv6, Base64, JSON, YAML)"]
            TgBot["Telegram Bot Демон (telego, /start, онбординг, админ-пульт)"]
            CronManager["Планировщик фоновых задач (web/job/*)<br/>10s трафик, лимит IP, алерт CPU, ротация логов"]
            
            subgraph Services["Сервисный слой (web/service/*)"]
                InboundSvc["InboundService"]
                TunnelSvc["TunnelService"]
                MtprotoSvc["MtprotoService"]
                RegSvc["RegistrationService"]
                XraySvc["XraySettingService"]
            end
            
            subgraph SharedCore["Shared-примитивы (shared/*)"]
                IPAM["IPAM (IPv4/IPv6 пулы)"]
                PortFwd["Port Forwarding (iptables)"]
                KeyGen["KeyGen (Curve25519)"]
            end
        end

        subgraph Storage["Слой хранения"]
            SQLite[("SQLite 3 DB<br/>/etc/x-ui/3ax-ui.db")]
        end

        subgraph ProtocolEngines["Сетевые движки и процессы"]
            XrayCore["Xray-Core Daemon<br/>(VLESS, VMess, Trojan, Shadowsocks)"]
            MTG["MTG Sidecar Daemon<br/>(MTProto Proxy FakeTLS)"]
            NDPPD["ndppd Daemon<br/>(NDP Proxy Native IPv6)"]
        end

        subgraph Kernel["Ядро Linux (Kernel Space)"]
            AWGKernel["AmneziaWG DKMS Module<br/>(awg0, обфускация Jc/Jmin/Jmax/S1-S4/H1-H4/I1-I5)"]
            WGKernel["Native WireGuard Module<br/>(wg0)"]
            Netfilter["Netfilter / iptables (DNAT, SNAT, FORWARD)"]
        end
    end

    Browser -->|HTTPS / WSS| WebServer
    TgUser -->|Telegram Bot API| TgBot
    SubClient -->|HTTP / HTTPS| SubServer
    SubClient -->|Трафик туннелей UDP| AWGKernel
    SubClient -->|Трафик туннелей UDP| WGKernel
    SubClient -->|Прокси трафик TCP/UDP| XrayCore
    SubClient -->|Telegram трафик TCP| MTG

    Main --> WebServer
    Main --> SubServer
    WebServer --> Services
    TgBot --> Services
    CronManager --> Services

    Services --> SQLite
    Services --> IPAM
    Services --> PortFwd
    Services --> KeyGen

    Services -->|gRPC Stats & API :62789| XrayCore
    Services -->|fork/exec / SIGTERM| MTG
    Services -->|awg syncconf / ip link| AWGKernel
    Services -->|wg syncconf / ip link| WGKernel
    Services -->|конфигурация ndppd.conf| NDPPD
    PortFwd -->|генерация правил 3ax-fwd-*| Netfilter
```

---

## 2. Иерархия слоев (Layered Architecture)

Вся кодовая база строго разделена на 5 уровней абстракции с однонаправленным потоком зависимостей:

```text
Level 0: Bootstrap & Runtime (main, config, logger, util, deployment)
   │
   ▼
Level 1: Storage & Shared Primitives (database, model, shared/ipam, portfwd, ndppd)
   │
   ▼
Level 2: Core Protocol Engines (tunnel/awg, tunnel/wg, xray, mtproto, sub)
   │
   ▼
Level 3: Business Services & Background Jobs (web/service, web/job)
   │
   ▼
Level 4: Presentation & Consumers (web/controller, bot, web/html)
```

| Слой | Каталоги | Назначение и зона ответственности |
| :--- | :--- | :--- |
| **Level 0** | `main.go`, `config/`, `logger/`, `util/`, `install.sh` | Инициализация среды, парсинг CLI аргументов, конфигурация путей, ротация логов, системные сигналы и инсталляторы. |
| **Level 1** | `database/`, `database/model/`, `shared/` | Доступ к SQLite через GORM, схема реляционных связей, управление IP-пулами (IPAM), правила `iptables` и генератор ключей Curve25519. |
| **Level 2** | `tunnel/`, `xray/`, `mtproto/`, `sub/` | Низкоуровневые движки: генерация параметров обфускации AmneziaWG (1.x–3.1), компиляция JSON для Xray, gRPC клиент статистики, запуск сайдкаров `mtg` и формирование подписок. |
| **Level 3** | `web/service/`, `web/job/` | Бизнес-логика панели: CRUD клиентов, транслитерация кириллических имен, учет лимитов трафика, cron-демоны (каждые 10с), сторожевой таймер Xray. |
| **Level 4** | `web/controller/`, `bot/`, `web/html/` | Точки взаимодействия: REST API маршруты `/panel/api/*`, интерактивный Telegram-бот, Web UI страницы и WebSocket рассылка телеметрии. |

---

## 3. Ключевые архитектурные решения

### 3.1. Ампутация NAT66 и переход на Native IPv6 (NDP Proxy)
В отличие от стандартных панелей управления, 3AX-UI не использует NAT66 для IPv6 клиентов WireGuard/AmneziaWG. Вместо этого:
1. Выделяется реальная публичная подсеть IPv6 (например `/64` или `/80`).
2. Встроенный сервис [ndppd](/shared/ndppd) перехватывает запросы Neighbor Solicitation на внешнем WAN интерфейсе хоста и анонсирует IPv6-адреса клиентов туннелей.
3. Клиенты получают полноценный чистый IPv6-адрес без маскарадинга.

### 3.2. Обфускация AmneziaWG поколений 1.x, 2.0 и 3.x
Архитектура туннелей поддерживает три поколения параметров обфускации:
- **AWG 1.x:** Мусорные пакеты инициализации (`Jc`, `Jmin`, `Jmax`) и фиксированные сдвиги заголовков (`S1`, `S2`, `H1`–`H4`).
- **AWG 2.0:** Расширенные смещения (`S3`, `S4`), динамические диапазоны `H1`–`H4`, параметр `I1` и байты `I2`–`I5`.
- **AWG 3.0 / 3.1:** Криптографическая защита заголовков потоковым шифром ChaCha20 через `HeaderProtectionKey`, рандомизированные трейлеры (`RandomTrailers`) и плавающие таймеры `CookieTimeout`.

### 3.3. Telegram Bot и защита от конфликта 409
Для предотвращения состояния гонки Telegram Long Polling при горячем перезапуске панели по сигналу `SIGHUP` (код ошибки HTTP 409 Conflict):
- Реализован скоординированный вызов [service.StopBot()](/bot/architecture), который разрывает сессию с Telegram API до остановки слушателей веб-сервера.
- Инициализация нового экземпляра бота выполняется строго после поднятия HTTP-эндпоинтов.

### 3.4. Изоляция процессов и Healing Daemon
Все внешние движки изолированы:
- **Xray-Core** работает как дочерний процесс и опрашивается через локальный gRPC сокет (`127.0.0.1:62789`).
- Туннели **AmneziaWG** и **WireGuard** конфигурируются напрямую через сетевой стек ядра (`netlink` и `syncconf`). В фоне работает [Healing Daemon](/protocols/tunnel/healing-daemon), который раз в минуту сверяет статус интерфейсов и автоматически восстанавливает упавшие линки при сбоях сетевого стека или перезапуске NetworkManager/systemd-networkd.
