# AppleShop — публичная витрина

Отдельный Next.js-сайт (сервер B). Каталог и медиа читаются только из публичного Read-API склада (сервер A).  
Postgres и папка `media/` на сайт не копируются и снаружи не открываются.

## Стек

- Next.js (App Router, TypeScript)
- Tailwind CSS
- GSAP (`gsap` + `@gsap/react`) — stagger появления карточек

## Переменные окружения

Скопируйте `.env.example` в `.env.local`:

```bash
NEXT_PUBLIC_API_BASE=https://appleshop.ap43.ru
```

Секреты бота и доступ к БД на сайте не нужны.

## Публичный API склада

База: `https://appleshop.ap43.ru`

- `GET /api/public/health`
- `GET /api/public/products?kind=used|new&limit=1..100&skip=0`
- `GET /api/public/products/{id}`

Внутренний `/api/products` закрыт — не использовать.

Сайт ходит только на `${NEXT_PUBLIC_API_BASE}/api/public/...`.

У товара есть объект `links` (product + fallback с posts): `telegram`, `vk_market`, `vk_post`, `max`, `instagram`, `avito`.  
Для кнопки MAX на витрине используется `links.max` (HTTPS), не `max://` deep link.

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Проверка production-сборки:

```bash
npm run build
npm start
```

## Production на сервере B (`shop.ap43.ru`)

Уже настроено на этом хосте:

- systemd: `appleshop-storefront.service` → Next.js на `127.0.0.1:3000`
- nginx: `/etc/nginx/sites-available/shop.ap43.ru` → прокси на приложение
- публичный IP сервера B: `62.84.172.102`

### DNS (обязательно)

В панели домена `ap43.ru` создайте A-запись:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `shop` | `62.84.172.102` |

Не указывайте `shop` на IP склада (`94.159.110.11`) — там API/бот.  
`appleshop.ap43.ru` остаётся складом; `shop.ap43.ru` — витрина.

Проверка:

```bash
dig +short shop.ap43.ru A
# ожидается: 62.84.172.102
```

### HTTPS

Домен уже обслуживается: [https://shop.ap43.ru](https://shop.ap43.ru)

Повторный выпуск/обновление сертификата:

```bash
/root/online_catalog/scripts/enable-https.sh
```

### Управление сервисом

```bash
systemctl status appleshop-storefront
systemctl restart appleshop-storefront
journalctl -u appleshop-storefront -f
```

После обновления кода:

```bash
cd /root/online_catalog
npm install
npm run build
systemctl restart appleshop-storefront
```

Пока DNS не обновлён, сайт уже отвечает по IP с Host-заголовком:

`http://62.84.172.102/` (Host: `shop.ap43.ru`)

## Архитектура

```
Браузер → Next.js (хост B) → HTTPS /api/public/* (хост A)
                              ↘ абсолютные image_urls / video_urls с A
```

- Витрина развивается отдельно от Telegram-бота
- Данные склада: товары, фото, видео через готовый Read-API
- Supabase в v1 не подключён (каталог = только API склада)

## Структура

- `src/lib/api.ts` — типизированный fetch к public API
- `src/lib/product-links.ts` — внешние ссылки из `product.links` (Telegram / VK market / VK post / MAX / Instagram / Avito)
- `src/components/header.tsx` — sticky header по референсу
- `src/components/hero.tsx` — фильтры ALL / USED / NEW
- `src/components/product-card.tsx` — карточка + hover media
- `src/components/used-items-grid.tsx` / `new-items-grid.tsx` — две секции каталога
