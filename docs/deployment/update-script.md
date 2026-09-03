---
title: Скрипт обновления (update.sh)
description: Механизм бесшовного обновления 3AX-UI, резервное копирование SQLite и сохранение конфигурации туннелей
---

# Скрипт обновления (`update.sh`)

Скрипт [`update.sh`](../../update.sh) предназначен для безопасного обновления работающей панели 3AX-UI до актуальной версии без потери клиентских данных, настроек туннелей и статистики трафика.

---

## 1. Порядок выполнения обновления

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Администратор
    participant Script as update.sh
    participant Systemd as systemd (x-ui.service)
    participant Backup as Резервная копия БД
    participant Binary as Бинарные файлы (/usr/local/x-ui)
    participant DB as SQLite (/etc/x-ui/3ax-ui.db)

    Admin->>Script: Запуск update.sh
    Script->>Systemd: systemctl stop x-ui
    Note over Script: Создание резервной копии базы данных
    Script->>Backup: cp /etc/x-ui/3ax-ui.db /etc/x-ui/3ax-ui.db.backup.<timestamp>
    Note over Script: Получение и распаковка новых бинарников (x-ui, web/, bin/)
    Script->>Binary: Замена исполняемых файлов и ассетов
    Note over Script: ВАЖНО: Команда awg-gen2 намеренно ПРОПУСКАЕТСЯ!
    Script->>DB: Сохранение действующих параметров AWG
    Script->>Systemd: systemctl daemon-reload && systemctl start x-ui
    Systemd-->>Admin: Служба успешно перезапущена
```

---

## 2. Безопасность данных и сохранение конфигурации

### 2.1. Резервное копирование SQLite
Перед заменой исполняемого файла скрипт создает снимок базы данных:
```bash
cp /etc/x-ui/3ax-ui.db /etc/x-ui/3ax-ui.db.backup_$(date +%Y%m%d_%H%M%S)
```
В случае непредвиденных сбоев администратор может восстановить предыдущее состояние одной командой.

### 2.2. Сохранение параметров обфускации AmneziaWG
В отличие от первичного инсталлятора [`install.sh`](install-script.md), скрипт обновления **не вызывает** сабкоманду `awg-gen2`. Это принципиальное решение:
- Все действующие клиенты AmneziaWG сохраняют свои ключи, мусорные пакеты и заголовки обфускации.
- Профили на смартфонах и ПК пользователей продолжают работать без необходимости повторного импорта `.conf` файлов.

### 2.3. Поддержка ветки разработки (`--beta` / `--pre`)
При передаче флагов обновления:
```bash
./update.sh --beta
# или
./update.sh --pre
```
Скрипт переключается на ветку `dev`, скачивая предварительные сборки панели и сопутствующих утилит.
