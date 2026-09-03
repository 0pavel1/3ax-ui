---
title: Скрипт развертывания (install.sh)
description: Архитектура инсталлятора, детекция ОС и CPU, сборка из локального git-клона, установка DKMS AmneziaWG, ndppd и инициализация базы
---

# Скрипт установки (`install.sh`)

Скрипт [`install.sh`](../../install.sh) выполняет автоматизированное развертывание 3AX-UI на чистых Linux-серверах с настройкой модулей ядра, сетевых утилит, сайдкаров и генерацией параметров безопасности по умолчанию.

---

## 1. Архитектура и этапы инсталляции

```mermaid
flowchart TD
    Start([Запуск install.sh]) --> CheckRoot{EUID == 0 (root)?}
    CheckRoot -->|Нет| FailRoot[Фатальная ошибка root]
    CheckRoot -->|Да| DetectOS[Детекция дистрибутива Linux и архитектуры CPU]
    
    DetectOS --> CheckSource{is_local_source_install ?}
    CheckSource -->|Да| BuildLocal[Компиляция из локального git-клона: go build]
    CheckSource -->|Нет| DownloadRelease[Загрузка предсобранного релиза с GitHub]
    
    BuildLocal --> InstallDeps[Установка системных зависимостей]
    DownloadRelease --> InstallDeps
    
    InstallDeps --> InstallDKMS[Установка DKMS модуля AmneziaWG и amneziawg-tools]
    InstallDKMS --> InstallNDP[Установка ndppd для Native IPv6]
    InstallNDP --> InstallCore[Установка Xray-Core и MTG сайдкаров]
    
    InstallCore --> InitDB[Инициализация SQLite /etc/x-ui/3ax-ui.db]
    InitDB --> SeedAWG[Вызов ./x-ui awg-gen2: генерация параметров AWG 2.0]
    
    SeedAWG --> SetupSystemd[Установка systemd сервиса /etc/systemd/system/x-ui.service]
    SetupSystemd --> StartService[Запуск службы x-ui и вывод учетных данных]
    StartService --> End([Установка завершена])
```

---

## 2. Ключевые механизмы инсталлятора

### 2.1. Сборка из локального git-репозитория (`is_local_source_install`)
Скрипт поддерживает гибридный режим:
- Если он запущен через `curl ... | bash`, скрипт загружает готовые релизные архивы.
- Если скрипт вызван внутри склонированного репозитория (присутствуют `main.go`, `go.mod`, каталог `web/` и `.git/`), он автоматически собирает бинарник из исходников с передачей версии через `ldflags`:
  ```bash
  go build -ldflags "-X 'github.com/coinman-dev/3ax-ui/v2/config.version=${VERSION}'" -o /usr/local/x-ui/x-ui main.go
  ```

### 2.2. Установка AmneziaWG и DKMS ядра
В зависимости от дистрибутива:
- **Ubuntu:** Добавляется PPA `ppa:amnezia/ppa`, устанавливаются пакеты `amneziawg-dkms` и `amneziawg-tools`.
- **Debian:** Настраивается официальный репозиторий AmneziaWG либо выполняется сборка модуля через `dkms`.
- **RHEL / Rocky / AlmaLinux / Fedora:** Устанавливаются заголовки ядра `kernel-devel`, `dkms` и утилиты сборки.

### 2.3. Подсистема Native IPv6 (`ndppd`)
Инсталлятор настраивает сервис `ndppd` (Neighbor Discovery Protocol Proxy Daemon). Это позволяет серверу принимать и проксировать запросы Neighbour Solicitation на WAN-интерфейсе для IPv6 адресов, выделенных клиентам туннелей WireGuard/AmneziaWG, полностью исключая необходимость в устаревшем NAT66 маскарадинге.

### 2.4. Первичная генерация AmneziaWG 2.0 (`awg-gen2`)
При первичной установке вызывается сабкоманда:
```bash
/usr/local/x-ui/x-ui awg-gen2
```
Она генерирует криптографически стойкие параметры обфускации AWG 2.0 (`Jc`, `Jmin`, `Jmax`, `S1`–`S4`, `H1`–`H4`, `I1`), гарантируя, что первый созданный туннель AmneziaWG сразу готов к обходу DPI-блокировок.

---

## 3. Системный сервис Systemd (`x-ui.service`)

Инсталлятор регистрирует юниты systemd:

```ini
[Unit]
Description=3AX-UI Service
After=network.target nss-lookup.target

[Service]
Type=simple
User=root
WorkingDirectory=/usr/local/x-ui
ExecStart=/usr/local/x-ui/x-ui run
Restart=on-failure
RestartSec=10s
LimitNOFILE=infinity

[Install]
WantedBy=multi-user.target
```

Поддерживаются команды управления:
- `systemctl start x-ui` — старт службы.
- `systemctl reload x-ui` — отправка сигнала `SIGHUP` для мягкого рестарта HTTP-серверов.
- `systemctl restart x-ui` — полный перезапуск процесса.
