# Pinia сторы

Файлы: `src/stores/` и `src/stores/client/`

Сторы хранят **UI-состояние**: какой диалог открыт, текущие фильтры, черновик редактируемой формы. Серверные данные живут в TanStack Query, а не в сторах.

---

## Auth стор

**`src/stores/auth.js`**

Управляет сессией пользователя через `localStorage`.

```js
const authStore = useAuthStore()
```

| Метод | Описание |
|-------|---------|
| `getAccessToken()` | Читает `localStorage.access_token` |
| `setAccessToken(token)` | Записывает токен |
| `getMetadata()` | Парсит JSON из `localStorage.auth_metadata` |
| `setMetadata(metadata)` | Сохраняет метаданные сессии |
| `getUserRole()` | Возвращает `metadata.role` |
| `clearSession()` | Удаляет `access_token`, `auth_metadata`, `restaurant_id` из localStorage и sessionStorage |

---

## Admin сторы

### Рестораны

**`src/stores/restaurants.js`**

Управляет формой создания/редактирования ресторана и диалогами.

**Состояние формы** (`restaurantState`):
```
id, ownerId, name, address, minOrderSum, freeDeliveryFrom,
loyaltyIsEnabled, loyaltyPercent,
card, promo, sbp, split, phone, cash,   ← способы оплаты
pause, ban,                              ← статусы
lat, lng, payoutInfo, cuisinesInput
```

**Режим работы** (`workingHoursDays`): объект с ключами `mon`–`sun`, каждый — массив интервалов `{start, end}`.

**Фото**: `logoPhotoState`, `imagePhotoState` — объекты с `file`, `preview`, `url`.

**Диалоги**: `showDetailDialog`, `showDeleteDialog`.

**Методы**: `createRestaurant()`, `updateRestaurant()`, `updateRestaurantImages()`, `deleteRestaurant()`, `searchOwners()`, `handleOwnerSelect()`.

---

### Заказы (admin)

**`src/stores/orders.js`**

```js
const ordersStore = useOrdersStore()
```

**Фильтры** (`queryFilters`):
```
id, customerId, restaurantId, courierId, phone, status, startDate, endDate
```

**Методы**: `applyFilters()`, `resetFilters()`, `handleSearch()` (с debounce).

**UI**: `expandedRows`, глобальный фильтр для DataTable.

---

### Пользователи (customers)

**`src/stores/customers.js`**

Управляет CRUD-диалогами для пользователей.

**Состояние** (`customerState`):
```
id, phone, email, password, role, name, avatarUrl
```

**Флаги**: `showDetailDialog`, `isEdit`, `submitted`.

**Роли** (`roleOptions`):
- `customer` — покупатель
- `courier` — курьер
- `restaurant_owner` — владелец ресторана
- `manager` — менеджер
- `admin` — администратор

**Методы**: `createCustomer()`, `updateCustomer()`, `deleteCustomer()`, `getErrorMessage()`, `setRequestStatus()`.

---

### Курьеры (admin)

**`src/stores/couriers.js`**

Только чтение (список курьеров не редактируется через интерфейс).

- `couriersList` — данные из `useCouriersApi().getList()`
- `expandedRows`, глобальный фильтр DataTable, debounced-поиск

---

## Client сторы

### Заказы клиента

**`src/stores/client/orders.js`**

```js
const clientOrdersStore = useClientOrdersStore()
```

**Статусы заказов** (`statusLabels`):
```
ACCEPTED_BY_RESTAURANT → "Принят"
COOKING               → "Готовится"
READY                 → "Готов"
COURIER_ON_THE_WAY    → "Курьер в пути"
DELIVERED             → "Доставлен"
CANCELLED             → "Отменён"
```

**Категории заказов** (`categoryDefinitions`): группировка статусов для вкладок:
- `new` — новые
- `in_progress` — в работе
- `waiting_courier` — ожидают курьера
- `completed` — завершённые

**Хелперы**: `formatOrderNumber()`, `formatOrderTime()`, `buildOrderItems()`.

---

### Детали заказа

**`src/stores/client/orderDetail.js`**

Хранит данные одного открытого заказа, включая карту, позиции, статусы, действия подтверждения.

---

### История заказов

**`src/stores/client/orderHistory.js`**

Фильтры истории: дата начала, дата конца, статус. Список исторических заказов.

---

### Аналитика

**`src/stores/client/orderAnalytics.js`**

Агрегированные данные аналитики: выручка, количество заказов, средний чек. Фильтры по периоду.

---

### Отзывы

**`src/stores/client/orderReviews.js`**

Список отзывов на ресторан. Фильтр по рейтингу.

---

### Меню

**`src/stores/client/menu.js`**

Состояние управления меню:
- Активная вкладка статуса (активные / неактивные блюда)
- Список категорий и блюд
- Поиск по меню
- Выбранная категория
- Состояние загрузки изображений блюд

**Хелперы**: форматирование цены в локали `ru-RU`.

---

### Категории меню

**`src/stores/client/menuCategories.js`**

CRUD-состояние для управления категориями: форма добавления, редактирования, удаления.

---

### Профиль ресторана

**`src/stores/client/profile.js`**

Состояние формы профиля ресторана:

```
name, address, cuisines
minOrderSum, freeDeliveryFrom, deliveryCost
lat, lng
```

**Способы оплаты** (`paymentVariants`): card, cash, sbp, split, phone, promo — с флагом включения.

**Расписание**: открытие/закрытие по дням недели (`mon`–`sun`).

**Изображения**: logoPhotoState, imagePhotoState (с превью).

---

### Навигация

**`src/stores/client/navigation.js`**

Управляет заголовком страницы и кнопкой "назад" в ClientHeader.

```js
const navStore = useNavigationStore()
navStore.changeTitle('Мои заказы')
navStore.changeBackLinkVisible(true)
```

| Метод | Описание |
|-------|---------|
| `changeTitle(title)` | Устанавливает заголовок в header |
| `changeBackLinkVisible(val)` | Показывает/скрывает кнопку "назад" |
