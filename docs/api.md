# API слой

Файлы: `src/api/`

Каждый файл — набор функций, делающих axios-запросы. Никакой логики кэширования или состояния — только HTTP.

## Конфигурация axios

**`src/api/axios.instance.js`**

```
Base URL: https://admin.daimfood.ru/
```

**Request interceptor**: добавляет заголовок `Authorization: Bearer <token>` из `localStorage.access_token`.

**Response interceptor**: при 401 (кроме маршрутов `/auth/login` и `/auth/reset`) — очищает localStorage/sessionStorage и перенаправляет на `/auth/login`.

---

## Аутентификация

**`src/api/auth.js`**

| Функция | Метод | URL |
|---------|-------|-----|
| `login(data)` | POST | `/auth/login` |
| `register(data)` | POST | `/auth/register` |

**`src/api/user.js`**

| Функция | Метод | URL |
|---------|-------|-----|
| `getUser()` | GET | `/user/` |

---

## Admin API

### Рестораны

**`src/api/restaurants.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getRestaurants()` | GET | `/admin/restaurants/` | — |
| `getRestaurantById(id)` | GET | `/admin/restaurants/{id}` | — |
| `createRestaurant(payload)` | POST | `/admin/restaurants/add` | body |
| `updateRestaurant(payload)` | POST | `/admin/restaurants/update` | `?restaurant_id=`, body |
| `updateRestaurantImages(payload)` | POST | `/admin/restaurants/update/images` | FormData |
| `deleteRestaurant(id)` | POST | `/admin/restaurants/remove` | `?restaurant_id=` |

### Заказы

**`src/api/orders.js`**

| Функция | Метод | URL |
|---------|-------|-----|
| `getOrders(filters)` | GET | `/admin/orders` |

Параметры `filters`: `id`, `customer_id`, `restaurant_id`, `courier_id`, `phone`, `status`, `start_date`, `end_date`

### Пользователи (customers)

**`src/api/customers.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getCustomers()` | GET | `/admin/users` | — |
| `createCustomer(payload)` | POST | `/admin/user/create` | body |
| `updateCustomer(payload)` | POST | `/admin/user/update` | `?user_id=`, body |
| `deleteCustomer(id)` | POST | `/admin/user/remove` | `?user_id=` |

### Курьеры

**`src/api/couriers.js`**

| Функция | Метод | URL |
|---------|-------|-----|
| `getCouriers()` | GET | `/admin/couriers` |

### Реклама

**`src/api/ads.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getAds()` | GET | `/admin/ads/` | — |
| `getAdById(id)` | GET | `/admin/ads/{id}` | — |
| `createAd(payload)` | POST | `/admin/ads/add` | body |
| `updateAd(payload)` | POST | `/admin/ads/update` | body |
| `deleteAd(id)` | POST | `/admin/ads/remove` | `?ad_id=` |

---

## Client API (restaurant_owner)

### Профиль ресторана

**`src/api/clientRestaurants.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getRestaurantProfile(restaurantId)` | GET | `/restaurants/get` | `?restaurant_id=` |
| `updateRestaurantSettings(payload)` | POST | `/restaurants/settings` | body |
| `updateRestaurantImages(payload)` | POST | `/restaurants/settings/images` | FormData |

### Заказы ресторана

**`src/api/clientOrders.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getRestaurantOrders(restaurantId, {status, id})` | GET | `/restaurants/orders/` | `?restaurant_id=`, `status`, `id` |
| `updateRestaurantOrderStatus(payload)` | POST | `/restaurants/orders/status` | body |

### История заказов

**`src/api/clientOrdersHistory.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getOrdersHistory(restaurantId, status, start_date, end_date)` | GET | `/restaurants/history` | query params |

### Аналитика

**`src/api/clientAnalytics.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getRestaurantAnalytics(restaurantId, start_date, end_date)` | GET | `/restaurants/analytics` | query params |

### Отзывы

**`src/api/clientReviews.js`**

| Функция | Метод | URL | Параметры |
|---------|-------|-----|-----------|
| `getRestaurantReviews(restaurantId)` | GET | `/restaurants/reviews` | `?restaurant_id=` |
