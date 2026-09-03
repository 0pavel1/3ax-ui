---
layout: home

hero:
  name: "3AX-UI"
  text: "Архитектура и документация"
  tagline: "Расширенная панель управления Xray с нативной поддержкой AmneziaWG (1.x–3.1), Native IPv6 без NAT, FakeTLS MTProto и Telegram-онбордингом"
  image:
    src: /media/3ax-ui-dark.png
    alt: 3AX-UI
  actions:
    - theme: brand
      text: Архитектура проекта
      link: /architecture/overview
    - theme: alt
      text: Чек-лист покрытия (100%)
      link: /coverage

features:
  - icon: 🛡️
    title: AmneziaWG (1.x, 2.0, 3.0, 3.1)
    details: Обфускация WireGuard, защита заголовков ChaCha20 (HeaderProtectionKey), плавающие таймеры, диапазоны H1–H4 и per-client iptables port forwarding.
  - icon: 🤖
    title: Telegram Bot Onboarding
    details: Пошаговая регистрация через /start с валидацией ФИО на кириллице, интерактивный админ-аппрув, автовыдача .conf/QR во всех протоколах.
  - icon: ⚡
    title: Native WireGuard & IPv6
    details: Выделение реальных публичных IPv6 адресов клиентам без NAT66 через встроенный NDP proxy (ndppd).
  - icon: 🔒
    title: MTProto (FakeTLS)
    details: Интегрированные сайдкары mtg и mtg-multi (сотни пользователей на одном порту) с возможностью маршрутизации в Xray outbounds.
  - icon: 📊
    title: 100% Code Coverage
    details: Полное покрытие всех 142 файлов кодовой базы (Go, shell, SQL/GORM, cron jobs, API, UI) сверху вниз по дереву зависимостей.
  - icon: 🛠️
    title: Модульность и надежность
    details: Механизм самовосстановления интерфейсов (healing daemon), защита от 409 конфликтов Telegram бота и isolated debug mode.
---
