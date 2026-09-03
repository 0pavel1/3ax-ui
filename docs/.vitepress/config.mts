import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
  title: "3AX-UI",
  description: "Исчерпывающая техническая документация и архитектурный справочник 3AX-UI",
  lang: 'ru-RU',
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/media/3ax-ui-dark.png',
    siteTitle: '3AX-UI Docs',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Поиск по документации'
              },
              modal: {
                noResultsText: 'Ничего не найдено по запросу',
                resetButtonTitle: 'Сбросить поиск',
                footer: {
                  selectText: 'Выбрать',
                  navigateText: 'Навигация',
                  closeText: 'Закрыть'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Архитектура', link: '/guide/architecture-overview' },
      { text: 'Ядро (Level 0)', link: '/core/main' },
      { text: 'База данных (Level 1)', link: '/database/core' },
      { text: 'Протоколы (Level 2)', link: '/protocols/tunnel/amnezia-obfuscation' },
      { text: 'Сервисы (Level 3)', link: '/services/inbound-service' },
      { text: 'Бот & API (Level 4)', link: '/bot/architecture' },
      { text: 'Чек-лист (100%)', link: '/coverage' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Введение & Архитектура',
          items: [
            { text: 'Обзор проекта', link: '/' },
            { text: 'Системная архитектура', link: '/guide/architecture-overview' },
            { text: 'Жизненный цикл и сигналы', link: '/guide/lifecycle' },
            { text: 'Чек-лист 100% покрытия', link: '/coverage' }
          ]
        },
        {
          text: 'Level 0: Bootstrap & Runtime',
          collapsed: false,
          items: [
            { text: 'Точка входа (main.go)', link: '/core/main' },
            { text: 'Конфигурация (config.go)', link: '/core/config' },
            { text: 'Логирование (logger.go)', link: '/core/logger' },
            { text: 'Системные утилиты (sys.go)', link: '/core/utils/sys' },
            { text: 'Криптография (crypto.go)', link: '/core/utils/crypto' },
            { text: 'Вспомогательные хелперы', link: '/core/utils/helpers' },
            { text: 'Инсталлятор (install.sh)', link: '/deployment/install-script' },
            { text: 'Скрипт обновления (update.sh)', link: '/deployment/update-script' },
            { text: 'Терминальный CLI (x-ui.sh)', link: '/deployment/cli-utility' }
          ]
        },
        {
          text: 'Level 1: Хранилище данных & Shared',
          collapsed: true,
          items: [
            { text: 'SQLite и GORM пулы', link: '/database/core' },
            { text: 'Механика миграций схемы', link: '/database/migrations' },
            {
              text: 'Модели базы данных',
              items: [
                { text: 'Inbound & User', link: '/database/models/inbound-user' },
                { text: 'AmneziaWG', link: '/database/models/amneziawg' },
                { text: 'Native WireGuard', link: '/database/models/wireguard' },
                { text: 'Общие туннельные структуры', link: '/database/models/tunnel-common' },
                { text: 'MTProto Proxy', link: '/database/models/mtproto' },
                { text: 'Очередь регистраций бота', link: '/database/models/registration' }
              ]
            },
            {
              text: 'Системные Shared-примитивы',
              items: [
                { text: 'Ключи Curve25519 (keygen)', link: '/shared/keygen' },
                { text: 'Менеджер пулов IP (IPAM)', link: '/shared/ipam' },
                { text: 'Проброс портов (iptables)', link: '/shared/portfwd' },
                { text: 'NDP Proxy (Native IPv6)', link: '/shared/ndppd' },
                { text: 'TProxy правила', link: '/shared/tproxy' }
              ]
            }
          ]
        },
        {
          text: 'Level 2: Движки протоколов & Сайдкары',
          collapsed: true,
          items: [
            {
              text: 'AmneziaWG & WireGuard',
              items: [
                { text: 'Типизация туннелей', link: '/protocols/tunnel/kind' },
                { text: 'Обфускация 1.x, 2.0, 3.x', link: '/protocols/tunnel/amnezia-obfuscation' },
                { text: 'Генератор .conf профилей', link: '/protocols/tunnel/config-generator' },
                { text: 'Менеджер интерфейсов', link: '/protocols/tunnel/manager' },
                { text: 'Демон самовосстановления', link: '/protocols/tunnel/healing-daemon' },
                { text: 'NDP Daemon Service', link: '/protocols/tunnel/ndp-service' }
              ]
            },
            {
              text: 'Xray-Core Engine',
              items: [
                { text: 'Управление процессом ядра', link: '/protocols/xray/process-manager' },
                { text: 'Компилятор конфигураций', link: '/protocols/xray/config-compiler' },
                { text: 'gRPC клиент управления', link: '/protocols/xray/grpc-client' },
                { text: 'Сбор статистики трафика', link: '/protocols/xray/traffic-stats' }
              ]
            },
            {
              text: 'MTProto Proxy Sidecar',
              items: [
                { text: 'Сайдкары mtg и mtg-multi', link: '/protocols/mtproto/process-manager' },
                { text: 'FakeTLS секреты и маскировка', link: '/protocols/mtproto/faketls' }
              ]
            },
            {
              text: 'Сервер подписок',
              items: [
                { text: 'HTTP сервер подписок', link: '/protocols/sub/http-server' },
                { text: 'Форматы (Clash, sing-box)', link: '/protocols/sub/formats' },
                { text: 'Кэширование в памяти', link: '/protocols/sub/cache' }
              ]
            }
          ]
        },
        {
          text: 'Level 3: Сервисный слой & Cron',
          collapsed: true,
          items: [
            {
              text: 'Бизнес-сервисы',
              items: [
                { text: 'Inbound Service', link: '/services/inbound-service' },
                { text: 'Outbound & Routing', link: '/services/outbound-service' },
                { text: 'Tunnel Service (AWG/WG)', link: '/services/tunnel-service' },
                { text: 'MTProto Service', link: '/services/mtproto-service' },
                { text: 'Registration & Translit', link: '/services/registration-service' },
                { text: 'Настройки и 2FA', link: '/services/setting-service' },
                { text: 'Xray Core Service', link: '/services/xray-service' },
                { text: 'Кастомный GeoIP/GeoSite', link: '/services/custom-geo' },
                { text: 'Системные метрики хоста', link: '/services/panel-metrics' },
                { text: 'WARP & NordVPN', link: '/services/warp-nord' },
                { text: 'Сетевая инфраструктура', link: '/services/infrastructure' }
              ]
            },
            {
              text: 'Планировщик фоновых задач (Cron)',
              items: [
                { text: 'Сбор трафика (каждые 10с)', link: '/jobs/traffic-collector' },
                { text: 'Мониторинг IP клиентов', link: '/jobs/client-ip-monitor' },
                { text: 'Алерты ресурсов хоста', link: '/jobs/resource-alarms' },
                { text: 'Обслуживание и ротация логов', link: '/jobs/maintenance' }
              ]
            }
          ]
        },
        {
          text: 'Level 4: Telegram-бот, API & Web UI',
          collapsed: true,
          items: [
            {
              text: 'Telegram-бот онбординга',
              items: [
                { text: 'Архитектура и защита от 409', link: '/bot/architecture' },
                { text: 'Флоу регистрации (/start, ФИО)', link: '/bot/onboarding-flow' },
                { text: 'Пульт администратора [Approve]', link: '/bot/admin-approval' },
                { text: 'Автопровижининг и выдача .conf/QR', link: '/bot/auto-provisioning' }
              ]
            },
            {
              text: 'REST API & Сессии',
              items: [
                { text: 'Bootstrap веб-сервера', link: '/api/server-bootstrap' },
                { text: 'Авторизация и сессии', link: '/api/auth' },
                { text: 'Безопасность роутинга (404)', link: '/api/routing-security' },
                { text: 'API инбаундов Xray', link: '/api/inbounds' },
                { text: 'API туннелей AWG/WG', link: '/api/tunnels' },
                { text: 'API MTProto Proxy', link: '/api/mtproto' },
                { text: 'API системных настроек', link: '/api/settings' },
                { text: 'API конфигурации Xray', link: '/api/xray-settings' },
                { text: 'API статуса сервера', link: '/api/server' },
                { text: 'WebSocket трансляция метрик', link: '/api/websocket' }
              ]
            },
            {
              text: 'Web UI & Локализация',
              items: [
                { text: 'HTML шаблоны страниц', link: '/ui/templates' },
                { text: 'Статические ассеты и стили', link: '/ui/assets' },
                { text: 'Интернационализация (i18n)', link: '/ui/i18n' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/0pavel1/3ax-ui' }
    ],

    footer: {
      message: 'Опубликовано под лицензией GNU GPL v3',
      copyright: 'Copyright © 2026 3AX-UI Contributors'
    }
  }
}))
