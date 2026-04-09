# Маршрутизация

Файл: `src/router/index.js`

Base path: `/front/` (GitHub Pages)

## Структура маршрутов

```
/                         → redirect /admin

/admin                    (AdminLayout)
├── /admin/dashboard      → DashboardView
├── /admin/restaurants    → RestaurantsView
├── /admin/orders         → OrdersView
├── /admin/users          → CustomersView
├── /admin/couriers       → CouriersView
└── /admin/ads            → AdsView

/client                   (ClientLayout)
├── /client/profile       → ProfileView
│   ├── /client/profile/settings  → ProfileSettingsView
│   ├── /client/profile/rules     → ProfileRulesView
│   └── /client/profile/schedule  → ProfileScheduleView
├── /client/orders        → OrdersClientView
│   ├── /client/orders/:orderId   → OrderDetailView
│   ├── /client/orders/history    → OrderHistoryView
│   ├── /client/orders/analytics  → OrderAnalyticsView
│   └── /client/orders/reviews    → OrderReviewsView
└── /client/menu          → MenuView
    ├── /client/menu/search                    → MenuSearchView
    ├── /client/menu/categories                → MenuCategoryListView
    ├── /client/menu/categories/:categoryId    → MenuCategoryView
    ├── /client/menu/items/new                 → MenuDishView
    └── /client/menu/items/:itemId             → MenuDishView

/auth
├── /auth/login           → LoginView
├── /auth/register        → RegisterView
├── /auth/access          → AccessView (доступ запрещён)
└── /auth/error           → ErrorView
```

## Navigation Guards

Порядок выполнения при каждом переходе:

### 1. Инъекция токена из URL

Если в URL есть `?token=...` — сохраняет в `localStorage.access_token` через auth store.  
Если есть `?restaurantId=...` — сохраняет в `localStorage.restaurant_id`.

Используется для перехода из внешних систем без ручного логина.

### 2. Проверка аутентификации

Если пользователь не авторизован (нет токена) и пытается открыть не-`/auth/` маршрут — редирект на `/auth/login`.

### 3. Role-based guards

| Условие | Действие |
|---------|---------|
| `restaurant_owner` пытается открыть `/admin/*` | Редирект на `/client/profile` |
| `manager` пытается открыть маршрут кроме dashboard/orders | Редирект на `/auth/access` |

### 4. Защита auth-маршрутов

Авторизованный пользователь, открывающий `/auth/*`, редиректится по роли:
- `restaurant_owner` → `/client/profile`
- остальные → `/admin/dashboard`

## Доступ по ролям

| Маршрут | admin | manager | restaurant_owner |
|---------|-------|---------|----------------|
| `/admin/dashboard` | ✓ | ✓ | — |
| `/admin/restaurants` | ✓ | — | — |
| `/admin/orders` | ✓ | ✓ | — |
| `/admin/users` | ✓ | — | — |
| `/admin/couriers` | ✓ | — | — |
| `/admin/ads` | ✓ | — | — |
| `/client/*` | — | — | ✓ |
