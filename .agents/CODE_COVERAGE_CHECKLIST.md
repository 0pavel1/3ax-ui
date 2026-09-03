# 3AX-UI — Чек-лист 100% покрытия документацией кодовой базы

> **Цель:** Полный аудит и 100% покрытие каждого файла исходного кода проекта.  
> **Принцип:** Гранулярная декомпозиция (1 логический модуль / важный файл = 1 отдельный `.md` документ).  
> **Методология:** Сверху вниз по графу зависимостей (Level 0 → Level 4).  
> **Последнее обновление:** 2026-09-03

---

## 📊 Сводка прогресса

| Уровень архитектуры | Каталог документации | Всего файлов | Покрыто | Процент |
| :--- | :--- | :---: | :---: | :---: |
| **Level 0: Bootstrap & Runtime** | `docs/core/`, `docs/deployment/` | 18 | 0 | 0.0% |
| **Level 1: Storage, Models & Shared** | `docs/database/`, `docs/shared/` | 22 | 0 | 0.0% |
| **Level 2: Core Protocol Engines** | `docs/protocols/` (xray, tunnel, mtproto, sub) | 33 | 0 | 0.0% |
| **Level 3: Business Services & Jobs** | `docs/services/`, `docs/jobs/` | 46 | 0 | 0.0% |
| **Level 4: Presentation, API & Bot** | `docs/bot/`, `docs/api/`, `docs/ui/` | 23 | 0 | 0.0% |
| **ИТОГО ПО КОДОВОЙ БАЗЕ** | | **142** | **0** | **0.0%** |

---

## Level 0: Входная точка, рантайм, утилиты и скрипты развертывания

### Ядро рантайма (`docs/core/`)
- [ ] [`main.go`](main.go) ➔ `docs/core/main.md`  
  *Точка входа, CLI-сабкоманды (`run`, `migrate`, `awg-gen2`, `setting`, `cert`), перехват сигналов ОС (`syscall.SIGHUP`, `syscall.SIGTERM`, `sys.SIGUSR1`), жизненный цикл серверов.*
- [ ] [`config/config.go`](config/config.go) ➔ `docs/core/config.md`  
  *Чтение версий из ldflags/файла, пути к базе данных SQLite, рабочие порты, флаги отладки.*
- [ ] [`logger/logger.go`](logger/logger.go) ➔ `docs/core/logger.md`  
  *Подсистема логирования на базе `op/go-logging`, уровни логов, кастомные форматтеры, вывод в stdout и файл.*
- [ ] [`logger/logger_test.go`](logger/logger_test.go) ➔ `docs/core/logger.md`  
  *Юнит-тесты подсистемы логирования.*

### Вспомогательные утилиты (`docs/core/utils/`)
- [ ] [`util/common/err.go`](util/common/err.go) ➔ `docs/core/utils/helpers.md`  
  *Обертки над системными ошибками и интерфейс обработки сбоев.*
- [ ] [`util/common/format.go`](util/common/format.go) ➔ `docs/core/utils/helpers.md`  
  *Форматирование байтов трафика (KB/MB/GB), времени и строковых системных констант.*
- [ ] [`util/common/multi_error.go`](util/common/multi_error.go) ➔ `docs/core/utils/helpers.md`  
  *Структура агрегации множественных ошибок для пакетных операций.*
- [ ] [`util/crypto/crypto.go`](util/crypto/crypto.go) ➔ `docs/core/utils/crypto.md`  
  *Хэширование паролей через `bcrypt`, верификация хэшей, криптографические операции.*
- [ ] [`util/json_util/json.go`](util/json_util/json.go) ➔ `docs/core/utils/helpers.md`  
  *Сериализация/десериализация JSON через оптимизированный движок `goccy/go-json`.*
- [ ] [`util/ldap/ldap.go`](util/ldap/ldap.go) ➔ `docs/core/utils/ldap.md`  
  *Клиент подключения к LDAP-каталогу, аутентификация и поиск учетных записей.*
- [ ] [`util/random/random.go`](util/random/random.go) ➔ `docs/core/utils/crypto.md`  
  *Генерация криптографически стойких случайных строк, токенов сессий и паролей.*
- [ ] [`util/reflect_util/reflect.go`](util/reflect_util/reflect.go) ➔ `docs/core/utils/helpers.md`  
  *Утилиты динамической рефлексии полей структур.*
- [ ] [`util/sys/psutil.go`](util/sys/psutil.go) ➔ `docs/core/utils/sys.md`  
  *Сбор системных метрик CPU, RAM, дискового пространства и сети через библиотеку `gopsutil`.*
- [ ] [`util/sys/sys_linux.go`](util/sys/sys_linux.go) ➔ `docs/core/utils/sys.md`  
  *Linux-специфичные системные вызовы, сигналы управления (`sys.SIGUSR1`).*
- [ ] [`util/sys/sys_windows.go`](util/sys/sys_windows.go) ➔ `docs/core/utils/sys.md`  
  *Windows-специфичные системные вызовы и полифиллы сигналов.*
- [ ] [`util/sys/sys_darwin.go`](util/sys/sys_darwin.go) ➔ `docs/core/utils/sys.md`  
  *macOS-специфичные системные вызовы.*

### Скрипты развертывания и CLI (`docs/deployment/`)
- [ ] [`install.sh`](install.sh) ➔ `docs/deployment/install-script.md`  
  *Главный инсталлятор: детекция ОС, PPA amnezia, установка DKMS модуля, сборка из локального git-клона.*
- [ ] [`update.sh`](update.sh) ➔ `docs/deployment/update-script.md`  
  *Скрипт обновления: сохранение базы данных, детекция debug-режима, обновление бинарников.*
- [ ] [`x-ui.sh`](x-ui.sh) ➔ `docs/deployment/cli-utility.md`  
  *Интерактивное консольное меню управления: смена портов, сброс паролей, статус systemd-службы.*

---

## Level 1: База данных, модели и Shared-примитивы

### Хранилище данных SQLite & GORM (`docs/database/`)
- [ ] [`database/db.go`](database/db.go) ➔ `docs/database/core.md`  
  *Инициализация SQLite, настройка пула соединений GORM, запуск автомиграций.*
- [ ] [`database/tunnel_migrate.go`](database/tunnel_migrate.go) ➔ `docs/database/migrations.md`  
  *Миграция таблиц туннелей AWG/WG, схемы колонок port-forwarding и обратная совместимость.*
- [ ] [`database/tunnel_migrate_test.go`](database/tunnel_migrate_test.go) ➔ `docs/database/migrations.md`  
  *Тесты сценариев миграции данных туннелей.*
- [ ] [`database/awgwg_baseline_test.go`](database/awgwg_baseline_test.go) ➔ `docs/database/migrations.md`  
  *Тесты целостности базовой схемы таблиц AWG и Native WireGuard.*
- [ ] [`database/mtproto_migrate_test.go`](database/mtproto_migrate_test.go) ➔ `docs/database/migrations.md`  
  *Тестирование автоматической миграции MTProto со старого single-user на multi-user.*
- [ ] [`database/online_index_test.go`](database/online_index_test.go) ➔ `docs/database/core.md`  
  *Тесты индексации статусов онлайн-клиентов.*

### Модели базы данных (`docs/database/models/`)
- [ ] [`database/model/model.go`](database/model/model.go) ➔ `docs/database/models/inbound-user.md`  
  *Сущности `User`, `Inbound`, `Client`, `Setting`, `ClientTraffic`, `InboundTraffic`.*
- [ ] [`database/model/model_test.go`](database/model/model_test.go) ➔ `docs/database/models/inbound-user.md`  
  *Тесты валидации связей и внешних ключей моделей GORM.*
- [ ] [`database/model/awg.go`](database/model/awg.go) ➔ `docs/database/models/amneziawg.md`  
  *Модель настроек интерфейса AmneziaWG, конфигурация обфускации, пиры.*
- [ ] [`database/model/wg.go`](database/model/wg.go) ➔ `docs/database/models/wireguard.md`  
  *Модель настроек Native WireGuard, пиры, параметры IPv6 пула.*
- [ ] [`database/model/tunnel.go`](database/model/tunnel.go) ➔ `docs/database/models/tunnel-common.md`  
  *Общие структуры туннелей, настройки пиров и маппинга портов.*
- [ ] [`database/model/mtproto.go`](database/model/mtproto.go) ➔ `docs/database/models/mtproto.md`  
  *Модели инбаундов MTProto, пользователи сайдкара `mtg-multi`, FakeTLS секреты.*
- [ ] [`database/model/mtproto_test.go`](database/model/mtproto_test.go) ➔ `docs/database/models/mtproto.md`  
  *Тесты структур данных и ограничений MTProto.*
- [ ] [`database/model/registration.go`](database/model/registration.go) ➔ `docs/database/models/registration.md`  
  *Модель очереди заявок на регистрацию из Telegram-бота (ФИО, chat_id, статус).*

### Системные примитивы (`docs/shared/`)
- [ ] [`shared/crypto/keygen.go`](shared/crypto/keygen.go) ➔ `docs/shared/keygen.md`  
  *Генерация ключевых пар Curve25519 (`Private`, `Public`, `PresharedKey`) для WG и AWG.*
- [ ] [`shared/datagen/datagen.go`](shared/datagen/datagen.go) ➔ `docs/shared/datagen.md`  
  *Генераторы дефолтных значений и тестовых структур.*
- [ ] [`shared/ipam/ipam.go`](shared/ipam/ipam.go) ➔ `docs/shared/ipam.md`  
  *Менеджер пулов IP-адресов: выделение и освобождение IPv4/IPv6 для клиентов интерфейса.*
- [ ] [`shared/ndppd/ndppd.go`](shared/ndppd/ndppd.go) ➔ `docs/shared/ndppd.md`  
  *Генератор конфигурации демона NDP proxy для выдачи реального IPv6 клиентам без NAT66.*
- [ ] [`shared/ndppd/ndppd_test.go`](shared/ndppd/ndppd_test.go) ➔ `docs/shared/ndppd.md`  
  *Тесты генератора конфигураций `ndppd.conf`.*
- [ ] [`shared/portfwd/portfwd.go`](shared/portfwd/portfwd.go) ➔ `docs/shared/portfwd.md`  
  *Формирование и применение правил iptables DNAT/FORWARD с тегами `3ax-fwd-<uuid>`.*
- [ ] [`shared/portfwd/portfwd_test.go`](shared/portfwd/portfwd_test.go) ➔ `docs/shared/portfwd.md`  
  *Тестирование парсинга портов и генератора правил iptables.*
- [ ] [`shared/tproxy/tproxy.go`](shared/tproxy/tproxy.go) ➔ `docs/shared/tproxy.md`  
  *Конфигуратор правил маршрутизации TProxy.*
- [ ] [`shared/tproxy/tproxy_test.go`](shared/tproxy/tproxy_test.go) ➔ `docs/shared/tproxy.md`  
  *Тесты логики TProxy.*

---

## Level 2: Движки протоколов, сетевые туннели и сайдкары

### Подсистема AmneziaWG & Native WireGuard (`docs/protocols/tunnel/`)
- [ ] [`tunnel/kind.go`](tunnel/kind.go) ➔ `docs/protocols/tunnel/kind.md`  
  *Перечисление и типизация туннелей (`tunnel.TunnelKind` — AWG vs WG).*
- [ ] [`tunnel/types.go`](tunnel/types.go) ➔ `docs/protocols/tunnel/kind.md`  
  *Внутренние структуры туннелей, метаданные пиров и интерфейсов.*
- [ ] [`tunnel/obfuscation.go`](tunnel/obfuscation.go) ➔ `docs/protocols/tunnel/amnezia-obfuscation.md`  
  *Математика и параметры обфускации: 1.x (Jc, Jmin, Jmax, S1, S2, H1-H4), 2.0 (S3, S4, I1-I5, диапазоны), 3.0/3.1 (ChaCha20 `HeaderProtectionKey`, плавающие таймеры, RandomTrailers).*
- [ ] [`tunnel/obfuscation_test.go`](tunnel/obfuscation_test.go) ➔ `docs/protocols/tunnel/amnezia-obfuscation.md`  
  *Тестирование обфускации поколений 1.x и 2.0.*
- [ ] [`tunnel/obfuscation30_test.go`](tunnel/obfuscation30_test.go) ➔ `docs/protocols/tunnel/amnezia-obfuscation.md`  
  *Тестирование параметров обфускации AmneziaWG 3.0 и 3.1.*
- [ ] [`tunnel/config.go`](tunnel/config.go) ➔ `docs/protocols/tunnel/config-generator.md`  
  *Генератор конфигурационных файлов `awg0.conf`/`wg0.conf` и клиентских `.conf` профилей.*
- [ ] [`tunnel/config_test.go`](tunnel/config_test.go) ➔ `docs/protocols/tunnel/config-generator.md`  
  *Тесты парсинга и сборки конфигов WireGuard.*
- [ ] [`tunnel/config30_test.go`](tunnel/config30_test.go) ➔ `docs/protocols/tunnel/config-generator.md`  
  *Тесты генерации конфигураций с параметрами AWG 3.x.*
- [ ] [`tunnel/manager.go`](tunnel/manager.go) ➔ `docs/protocols/tunnel/manager.md`  
  *Менеджер системных интерфейсов (`ip link`, `awg syncconf`, `wg syncconf`).*
- [ ] [`tunnel/healing.go`](tunnel/healing.go) ➔ `docs/protocols/tunnel/healing-daemon.md`  
  *Фоновый демон самовосстановления упавших интерфейсов при перезагрузках или сетевых сбоях.*
- [ ] [`tunnel/healing_test.go`](tunnel/healing_test.go) ➔ `docs/protocols/tunnel/healing-daemon.md`  
  *Тестирование логики работы healing-демона.*
- [ ] [`tunnel/ndp.go`](tunnel/ndp.go) ➔ `docs/protocols/tunnel/ndp-service.md`  
  *Управление процессом ndppd и мониторинг проксирования соседских анонсов IPv6.*
- [ ] [`tunnel/version_test.go`](tunnel/version_test.go) ➔ `docs/protocols/tunnel/manager.md`  
  *Тесты детекции установленных версий утилит `amneziawg-tools`.*

### Сайдкар MTProto Proxy (`docs/protocols/mtproto/`)
- [ ] [`mtproto/manager.go`](mtproto/manager.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Оркестратор процессов `mtg` и `mtg-multi` на назначенных портах.*
- [ ] [`mtproto/manager_test.go`](mtproto/manager_test.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Тесты жизненного цикла менеджера процессов MTProto.*
- [ ] [`mtproto/manager_concurrency_test.go`](mtproto/manager_concurrency_test.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Тесты конкурентного запуска и остановки сайдкаров.*
- [ ] [`mtproto/process.go`](mtproto/process.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Управление дочерним процессом `mtg` (exec, pipes, сигналы).*
- [ ] [`mtproto/process_windows.go`](mtproto/process_windows.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Windows-специфичные заглушки сайдкара MTProto.*
- [ ] [`mtproto/process_other.go`](mtproto/process_other.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *POSIX-совместимое управление процессами.*
- [ ] [`mtproto/orphans_linux.go`](mtproto/orphans_linux.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Очистка процессов-сирот `mtg` в Linux после аварийного завершения.*
- [ ] [`mtproto/orphans_other.go`](mtproto/orphans_other.go) ➔ `docs/protocols/mtproto/process-manager.md`  
  *Заглушки очистки процессов для не-Linux сред.*
- [ ] [`mtproto/validate.go`](mtproto/validate.go) ➔ `docs/protocols/mtproto/faketls.md`  
  *Валидация FakeTLS секретов, маскировочных доменов и генерация deep link `tg://proxy`.*
- [ ] [`mtproto/validate_test.go`](mtproto/validate_test.go) ➔ `docs/protocols/mtproto/faketls.md`  
  *Тесты валидации параметров FakeTLS.*
- [ ] [`mtproto/defense_test.go`](mtproto/defense_test.go) ➔ `docs/protocols/mtproto/faketls.md`  
  *Тесты защиты от подмены параметров и некорректных секретов.*

### Интеграция с Xray Core (`docs/protocols/xray/`)
- [ ] [`xray/process.go`](xray/process.go) ➔ `docs/protocols/xray/process-manager.md`  
  *Запуск бинарника `xray-core`, мониторинг процесса, мягкий перезапуск.*
- [ ] [`xray/config.go`](xray/config.go) ➔ `docs/protocols/xray/config-compiler.md`  
  *Компиляция базы данных в JSON-конфигурацию Xray (inbounds, outbounds, routing, dns).*
- [ ] [`xray/api.go`](xray/api.go) ➔ `docs/protocols/xray/grpc-client.md`  
  *gRPC клиент к API Xray для динамического добавления/удаления пользователей без рестарта ядра.*
- [ ] [`xray/traffic.go`](xray/traffic.go) ➔ `docs/protocols/xray/traffic-stats.md`  
  *Опрос статистики входящего/исходящего трафика инбаундов через stats service gRPC.*
- [ ] [`xray/client_traffic.go`](xray/client_traffic.go) ➔ `docs/protocols/xray/traffic-stats.md`  
  *Опрос раздельной статистики трафика конкретных клиентов по тегам `user>>>EMAIL>>>traffic`.*
- [ ] [`xray/inbound.go`](xray/inbound.go) ➔ `docs/protocols/xray/config-compiler.md`  
  *Трансляторы протоколов VLESS, VMess, Trojan, Shadowsocks, SOCKS5, HTTP.*
- [ ] [`xray/log_writer.go`](xray/log_writer.go) ➔ `docs/protocols/xray/process-manager.md`  
  *Перехват и буферизация stdout/stderr логов ядра Xray.*

### Сервер подписок (`docs/protocols/sub/`)
- [ ] [`sub/sub.go`](sub/sub.go) ➔ `docs/protocols/sub/http-server.md`  
  *Автономный HTTP-сервер подписок (dual-stack IPv4/IPv6, рандомизированный базовый URL).*
- [ ] [`sub/subController.go`](sub/subController.go) ➔ `docs/protocols/sub/http-server.md`  
  *HTTP-обработчики маршрутов `/sub/:id` и `/json/:id`.*
- [ ] [`sub/subService.go`](sub/subService.go) ➔ `docs/protocols/sub/formats.md`  
  *Генерация Base64-списков ссылок подключения (`vless://`, `vmess://`, `ss://`, `awg`).*
- [ ] [`sub/subservice_test.go`](sub/subservice_test.go) ➔ `docs/protocols/sub/formats.md`  
  *Тесты генерации форматов ссылок подписки.*
- [ ] [`sub/subClashService.go`](sub/subClashService.go) ➔ `docs/protocols/sub/formats.md`  
  *Формирование профилей подписок для клиентов Clash и Mihomo (YAML).*
- [ ] [`sub/subJsonService.go`](sub/subJsonService.go) ➔ `docs/protocols/sub/formats.md`  
  *Формирование профилей подписок для клиента sing-box (JSON).*
- [ ] [`sub/inbound_cache.go`](sub/inbound_cache.go) ➔ `docs/protocols/sub/cache.md`  
  *Кэширование активных инбаундов в памяти для быстрой отдачи подписок под высокой нагрузкой.*
- [ ] [`sub/inbound_cache_test.go`](sub/inbound_cache_test.go) ➔ `docs/protocols/sub/cache.md`  
  *Тесты работы и инвалидации кэша подписок.*

---

## Level 3: Сервисный слой бизнес-логики и фоновые задачи

### Бизнес-сервисы (`docs/services/`)
- [ ] [`web/service/inbound.go`](web/service/inbound.go) ➔ `docs/services/inbound-service.md`  
  *CRUD инбаундов и клиентов Xray, авто-квоты, сброс трафика, переименование юзеров без сброса статистики.*
- [ ] [`web/service/outbound.go`](web/service/outbound.go) ➔ `docs/services/outbound-service.md`  
  *Управление маршрутизацией, правилами обхода и аутбаундами (Freedom, Blackhole, DNS, SOCKS-мост).*
- [ ] [`web/service/tunnel_service.go`](web/service/tunnel_service.go) ➔ `docs/services/tunnel-service.md`  
  *Высокоуровневый сервис AWG/WG: выдача IP через IPAM, создание правил portfwd, генерация QR и .conf.*
- [ ] [`web/service/tunnel_service_test.go`](web/service/tunnel_service_test.go) ➔ `docs/services/tunnel-service.md`  
  *Тесты бизнес-логики туннельного сервиса.*
- [ ] [`web/service/tunnel_port.go`](web/service/tunnel_port.go) ➔ `docs/services/tunnel-service.md`  
  *Валидация и выделение свободных сетевых портов для туннелей.*
- [ ] [`web/service/mtproto_service.go`](web/service/mtproto_service.go) ➔ `docs/services/mtproto-service.md`  
  *Сервис управления пирами MTProto, назначение портов и секретов.*
- [ ] [`web/service/mtproto_port_test.go`](web/service/mtproto_port_test.go) ➔ `docs/services/mtproto-service.md`  
  *Тесты портов MTProto.*
- [ ] [`web/service/mtproto_refactor_test.go`](web/service/mtproto_refactor_test.go) ➔ `docs/services/mtproto-service.md`  
  *Регрессионные тесты сервиса MTProto.*
- [ ] [`web/service/registration.go`](web/service/registration.go) ➔ `docs/services/registration-service.md`  
  *Очередь заявок пользователей, статусы (pending/approved/rejected).*
- [ ] [`web/service/translit.go`](web/service/translit.go) ➔ `docs/services/registration-service.md`  
  *Алгоритм строгой транслитерации кириллических имен пользователей в email-теги.*
- [ ] [`web/service/translit_test.go`](web/service/translit_test.go) ➔ `docs/services/registration-service.md`  
  *Тесты транслитерации имен.*
- [ ] [`web/service/xray.go`](web/service/xray.go) ➔ `docs/services/xray-service.md`  
  *Сервис контроля ядра Xray: отслеживание флага необходимости перезапуска.*
- [ ] [`web/service/xray_mtproto_test.go`](web/service/xray_mtproto_test.go) ➔ `docs/services/xray-service.md`  
  *Тестирование связи роутинга MTProto через Xray.*
- [ ] [`web/service/xray_setting.go`](web/service/xray_setting.go) ➔ `docs/services/xray-service.md`  
  *Управление настройками Xray (DNS-серверы, правила маршрутизации).*
- [ ] [`web/service/xray_setting_test.go`](web/service/xray_setting_test.go) ➔ `docs/services/xray-service.md`  
  *Тесты валидации параметров Xray.*
- [ ] [`web/service/custom_geo.go`](web/service/custom_geo.go) ➔ `docs/services/custom-geo.md`  
  *Управление пользовательскими базами маршрутизации GeoIP и GeoSite.*
- [ ] [`web/service/custom_geo_test.go`](web/service/custom_geo_test.go) ➔ `docs/services/custom-geo.md`  
  *Тесты загрузки кастомных списков маршрутизации.*
- [ ] [`web/service/setting.go`](web/service/setting.go) ➔ `docs/services/setting-service.md`  
  *Чтение/запись конфигураций: порты, ключи, пути сессий, токены бота.*
- [ ] [`web/service/user.go`](web/service/user.go) ➔ `docs/services/user-service.md`  
  *Учетные записи администраторов, смена паролей, TOTP 2FA.*
- [ ] [`web/service/server.go`](web/service/server.go) ➔ `docs/services/server-coordinator.md`  
  *Центральный сервисный координатор жизненного цикла всех служб.*
- [ ] [`web/service/panel.go`](web/service/panel.go) ➔ `docs/services/panel-metrics.md`  
  *Сбор хостовых метрик для веб-дашборда (аптайм, загрузка, память).*
- [ ] [`web/service/panel_unix.go`](web/service/panel_unix.go) ➔ `docs/services/panel-metrics.md`  
  *Unix-специфичные метрики (температура процессора, нагрузка).*
- [ ] [`web/service/panel_other.go`](web/service/panel_other.go) ➔ `docs/services/panel-metrics.md`  
  *Заглушки метрик для других ОС.*
- [ ] [`web/service/panel_test.go`](web/service/panel_test.go) ➔ `docs/services/panel-metrics.md`  
  *Тестирование сбора системных метрик.*
- [ ] [`web/service/network_interface.go`](web/service/network_interface.go) ➔ `docs/services/network-interface.md`  
  *Автоопределение внешнего сетевого интерфейса хоста.*
- [ ] [`web/service/warp.go`](web/service/warp.go) ➔ `docs/services/warp-nord.md`  
  *Интеграция с Cloudflare WARP для выходных прокси.*
- [ ] [`web/service/nord.go`](web/service/nord.go) ➔ `docs/services/warp-nord.md`  
  *Интеграция с NordVPN outbounds.*

### Фоновые задачи cron (`docs/jobs/`)
- [ ] [`web/job/xray_traffic_job.go`](web/job/xray_traffic_job.go) ➔ `docs/jobs/traffic-collector.md`  
  *Опрос трафика Xray каждые 10 секунд и отключение клиентов по превышению квоты.*
- [ ] [`web/job/awg_traffic_job.go`](web/job/awg_traffic_job.go) ➔ `docs/jobs/traffic-collector.md`  
  *Опрос трафика AmneziaWG каждые 10 секунд и проверка лимитов пиров.*
- [ ] [`web/job/wg_traffic_job.go`](web/job/wg_traffic_job.go) ➔ `docs/jobs/traffic-collector.md`  
  *Опрос трафика Native WireGuard каждые 10 секунд.*
- [ ] [`web/job/mtproto_job.go`](web/job/mtproto_job.go) ➔ `docs/jobs/traffic-collector.md`  
  *Опрос трафика и реконсиляция сайдкаров MTProto.*
- [ ] [`web/job/check_client_ip_job.go`](web/job/check_client_ip_job.go) ➔ `docs/jobs/client-ip-monitor.md`  
  *Парсинг логов доступа каждые 10 секунд для применения лимита активных IP-адресов на клиента.*
- [ ] [`web/job/check_client_ip_job_test.go`](web/job/check_client_ip_job_test.go) ➔ `docs/jobs/client-ip-monitor.md`  
  *Юнит-тесты анализа логов IP.*
- [ ] [`web/job/check_client_ip_job_integration_test.go`](web/job/check_client_ip_job_integration_test.go) ➔ `docs/jobs/client-ip-monitor.md`  
  *Интеграционные тесты отслеживания IP.*
- [ ] [`web/job/check_cpu_usage.go`](web/job/check_cpu_usage.go) ➔ `docs/jobs/resource-alarms.md`  
  *Мониторинг превышения порога загрузки CPU с немедленной тревогой в Telegram-бот.*
- [ ] [`web/job/check_hash_storage.go`](web/job/check_hash_storage.go) ➔ `docs/jobs/maintenance.md`  
  *Очистка устаревших хэшей inline-кнопок Telegram каждые 2 минуты.*
- [ ] [`web/job/check_xray_running_job.go`](web/job/check_xray_running_job.go) ➔ `docs/jobs/maintenance.md`  
  *Сторожевой таймер процесса ядра Xray.*
- [ ] [`web/job/clear_logs_job.go`](web/job/clear_logs_job.go) ➔ `docs/jobs/maintenance.md`  
  *Ежедневная очистка устаревших access- и error-логов.*
- [ ] [`web/job/ldap_sync_job.go`](web/job/ldap_sync_job.go) ➔ `docs/jobs/maintenance.md`  
  *Периодическая фоновая синхронизация аккаунтов из LDAP.*
- [ ] [`web/job/periodic_traffic_reset_job.go`](web/job/periodic_traffic_reset_job.go) ➔ `docs/jobs/maintenance.md`  
  *Периодический сброс счетчиков трафика (ежечасно, ежедневно, еженедельно, ежемесячно).*
- [ ] [`web/job/stats_notify_job.go`](web/job/stats_notify_job.go) ➔ `docs/jobs/resource-alarms.md`  
  *Ежедневная отправка сводки трафика и активных клиентов администраторам в Telegram.*

### Сетевая инфраструктура и сессии (`docs/services/infrastructure.md`)
- [ ] [`web/network/auto_https_conn.go`](web/network/auto_https_conn.go) ➔ `docs/services/infrastructure.md`  
  *Детектор первого байта TLS ClientHello / HTTP.*
- [ ] [`web/network/auto_https_listener.go`](web/network/auto_https_listener.go) ➔ `docs/services/infrastructure.md`  
  *Dual-mode TCP listener для одновременной работы HTTP/HTTPS на одном порту.*
- [ ] [`web/session/session.go`](web/session/session.go) ➔ `docs/services/infrastructure.md`  
  *Управление cookie-сессиями Gin, время жизни сессий.*
- [ ] [`web/middleware/domainValidator.go`](web/middleware/domainValidator.go) ➔ `docs/services/infrastructure.md`  
  *Middleware фильтрации по доменному имени (защита от сканирования).*
- [ ] [`web/middleware/redirect.go`](web/middleware/redirect.go) ➔ `docs/services/infrastructure.md`  
  *Middleware редиректов.*
- [ ] [`web/locale/locale.go`](web/locale/locale.go) ➔ `docs/services/infrastructure.md`  
  *Загрузка 13 языковых пакетов переводов через `nicksnyder/go-i18n`.*
- [ ] [`web/websocket/hub.go`](web/websocket/hub.go) ➔ `docs/services/infrastructure.md`  
  *WebSocket Hub управления активными клиентскими соединениями веб-панели.*
- [ ] [`web/websocket/notifier.go`](web/websocket/notifier.go) ➔ `docs/services/infrastructure.md`  
  *Шина рассылки уведомлений в реальном времени.*
- [ ] [`web/entity/entity.go`](web/entity/entity.go) ➔ `docs/services/infrastructure.md`  
  *DTO структуры ответов.*
- [ ] [`web/global/global.go`](web/global/global.go) ➔ `docs/services/infrastructure.md`  
  *Глобальный контекст сервера.*
- [ ] [`web/global/hashStorage.go`](web/global/hashStorage.go) ➔ `docs/services/infrastructure.md`  
  *In-memory хранилище хэшей callback-кнопок.*

---

## Level 4: Презентационный уровень (Telegram Bot, REST API, Web UI)

### Telegram-бот онбординга (`docs/bot/`)
- [ ] [`web/service/tgbot.go`](web/service/tgbot.go) ➔ Разделяется на 4 гранулярных документа:
  - `docs/bot/architecture.md` — *Архитектура бота, поллинг telego, обработка конфликта 409 при SIGHUP-рестартах панели, селектор клавиатур.*
  - `docs/bot/onboarding-flow.md` — *Флоу `/start`: пошаговый диалог, строгая валидация ФИО на кириллице, защита от спама, отправка заявки.*
  - `docs/bot/admin-approval.md` — *Интерактивный админский пульт: уведомление о новой заявке, inline-кнопки `[Approve]` / `[Reject]`, callback-хэширование.*
  - `docs/bot/auto-provisioning.md` — *Автоматическое создание клиента сразу во всех Xray-инбаундах (`first_last_{id}`) и AmneziaWG (`first_last_awg_1`) под единым Subscription ID, прямая отгрузка `.conf` и QR в чат, меню `📖 Instructions`.*

### REST API и контроллеры панели (`docs/api/`)
- [ ] [`web/web.go`](web/web.go) ➔ `docs/api/server-bootstrap.md`  
  *Инициализация веб-сервера Gin, регистрация встроенных ассетов (embed), запуск роутера.*
- [ ] [`web/controller/base.go`](web/controller/base.go) ➔ `docs/api/server-bootstrap.md`  
  *Базовый контроллер, хелперы ответов JSON/HTML.*
- [ ] [`web/controller/index.go`](web/controller/index.go) ➔ `docs/api/auth.md`  
  *Контроллер аутентификации, логин, логаут, проверка TOTP 2FA.*
- [ ] [`web/controller/xui.go`](web/controller/xui.go) ➔ `docs/api/ui-pages.md`  
  *Контроллер страниц веб-интерфейса панели.*
- [ ] [`web/controller/api.go`](web/controller/api.go) ➔ `docs/api/routing-security.md`  
  *Маршрутизация `/panel/api/*`, middleware сокрытия эндпоинтов (404 вместо 401 для неавторизованных).*
- [ ] [`web/controller/inbound.go`](web/controller/inbound.go) ➔ `docs/api/inbounds.md`  
  *REST API эндпоинты управления инбаундами и клиентами Xray.*
- [ ] [`web/controller/server.go`](web/controller/server.go) ➔ `docs/api/server.md`  
  *REST API эндпоинты системного статуса, рестарта ядра, бэкапов БД.*
- [ ] [`web/controller/setting.go`](web/controller/setting.go) ➔ `docs/api/settings.md`  
  *REST API эндпоинты настроек панели, портов, путей и SSL сертификатов.*
- [ ] [`web/controller/xray_setting.go`](web/controller/xray_setting.go) ➔ `docs/api/xray-settings.md`  
  *REST API эндпоинты конфигурации Xray (DNS, правила роутинга).*
- [ ] [`web/controller/tunnel_controller.go`](web/controller/tunnel_controller.go) ➔ `docs/api/tunnels.md`  
  *REST API управления AmneziaWG и Native WireGuard (пиры, QR-коды, .conf, проброс портов).*
- [ ] [`web/controller/mtproto_controller.go`](web/controller/mtproto_controller.go) ➔ `docs/api/mtproto.md`  
  *REST API управления MTProto инбаундами и пользователями FakeTLS.*
- [ ] [`web/controller/custom_geo.go`](web/controller/custom_geo.go) ➔ `docs/api/custom-geo.md`  
  *REST API обновления и проверки правил GeoIP/GeoSite.*
- [ ] [`web/controller/websocket.go`](web/controller/websocket.go) ➔ `docs/api/websocket.md`  
  *WebSocket эндпоинт для real-time трансляции загрузки системы в UI.*
- [ ] [`web/controller/util.go`](web/controller/util.go) ➔ `docs/api/routing-security.md`  
  *Служебные эндпоинты панели.*

### Фронтенд и локализация (`docs/ui/`)
- [ ] [`web/html/`](web/html/) ➔ `docs/ui/templates.md`  
  *Go-шаблоны страниц панели, модальные окна создания клиентов и настроек.*
- [ ] [`web/assets/`](web/assets/) ➔ `docs/ui/assets.md`  
  *Статические ассеты, стили `custom.min.css`, клиентский скрипт подписок `subscription.js`.*
- [ ] [`web/translation/`](web/translation/) ➔ `docs/ui/i18n.md`  
  *Организация 13 TOML-файлов переводов интерфейса.*
