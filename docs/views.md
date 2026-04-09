# Представления (Views)

Файлы: `src/views/`

Компоненты-страницы — цели маршрутов Vue Router. Каждый view оркестрирует сервисы и сторы, рендерит компоненты.

---

## Auth Views (`src/views/admin/auth/`)

| Файл | Маршрут | Описание |
|------|---------|---------|
| `LoginView.vue` | `/auth/login` | Форма входа. После успеха редирект по роли через `useAuthApi` |
| `RegisterView.vue` | `/auth/register` | Форма регистрации |
| `AccessView.vue` | `/auth/access` | Страница «Доступ запрещён» (для manager без прав) |
| `ErrorView.vue` | `/auth/error` | Общая страница ошибки |

---

## Admin Views (`src/views/admin/`)

### DashboardView.vue — `/admin/dashboard`

Главная страница администратора. Агрегированная статистика.

---

### RestaurantsView.vue — `/admin/restaurants`

Управление ресторанами.

- **Данные**: `useRestaurantsApi().getList()` — список ресторанов
- **Стор**: `useRestaurantsStore()` — состояние форм и диалогов
- **Функциональность**:
  - DataTable с колонками: название, адрес, владелец, статус (пауза/бан), рейтинг
  - Диалог создания/редактирования: все поля ресторана + режим работы + способы оплаты
  - Загрузка логотипа и баннера (отдельный API-вызов)
  - Подтверждение удаления

---

### OrdersView.vue — `/admin/orders`

Просмотр всех заказов платформы.

- **Данные**: `useOrdersApi().getList(filters)` — реактивные фильтры
- **Стор**: `useOrdersStore()` — фильтры, expandedRows
- **Функциональность**:
  - Фильтрация по: ID заказа, клиенту, ресторану, курьеру, телефону, статусу, периоду дат
  - DataTable с раскрываемыми строками (позиции заказа)
  - Кнопки «Применить фильтры» / «Сбросить»

---

### CustomersView.vue — `/admin/users`

Управление пользователями платформы.

- **Данные**: `useCustomersApi().getList()`
- **Стор**: `useCustomersStore()`
- **Функциональность**:
  - DataTable: имя, телефон, email, роль
  - Диалог создания/редактирования с выбором роли
  - Удаление с подтверждением
  - Обработка ошибок с тостами

---

### CouriersView.vue — `/admin/couriers`

Список курьеров (только просмотр).

- **Данные**: `useCouriersApi().getList()`
- **Стор**: `useCouriersStore()`
- **Функциональность**: DataTable с поиском, expandedRows

---

### AdsView.vue — `/admin/ads`

Управление рекламными объявлениями.

- **Данные**: `useAdsApi().getList()`
- **Функциональность**: CRUD с диалогами, загрузка изображений

---

## Client Views (`src/views/client/`)

### HomeView.vue — `/client`

Главная страница restaurant_owner. Быстрый доступ к основным разделам.

---

## Профиль (`src/views/client/profile/`)

| Файл | Маршрут | Описание |
|------|---------|---------|
| `ProfileView.vue` | `/client/profile` | Обзор профиля ресторана: фото, название, рейтинг, способы оплаты |
| `ProfileSettingsView.vue` | `/client/profile/settings` | Редактирование: название, адрес, условия доставки, кухня, пауза |
| `ProfileScheduleView.vue` | `/client/profile/schedule` | Настройка часов работы по дням недели |
| `ProfileRulesView.vue` | `/client/profile/rules` | Правила работы с платформой |

**Стор**: `useProfileStore()` — состояние форм  
**Данные**: `clientRestaurants.js` API через store

---

## Заказы (`src/views/client/orders/`)

### OrdersClientView.vue — `/client/orders`

Активные заказы ресторана, сгруппированные по статусам.

- Вкладки: Новые / В работе / Ожидают курьера / Завершённые
- **Стор**: `useClientOrdersStore()` с `categoryDefinitions` и `statusLabels`
- **Данные**: `clientOrders.js` API, возможен polling для обновления

---

### OrderDetailView.vue — `/client/orders/:orderId`

Детальная информация об одном заказе.

- Карта с адресом доставки (`OrderDetailMap`)
- Список позиций заказа с суммами
- Информация о клиенте и курьере
- Действия: принять, отклонить, указать время готовности, отметить готовым
- Комментарий клиента
- **Стор**: `useOrderDetailStore()`

---

### OrderHistoryView.vue — `/client/orders/history`

История завершённых и отменённых заказов.

- Фильтры: период дат, статус
- Карточки заказов (`HistoryCard`)
- **Стор**: `useOrderHistoryStore()`

---

### OrderAnalyticsView.vue — `/client/orders/analytics`

Аналитика ресторана.

- Выручка, количество заказов, средний чек
- Популярные блюда (`PopularDishCard`)
- Фильтр по периоду
- **Стор**: `useOrderAnalyticsStore()`

---

### OrderReviewsView.vue — `/client/orders/reviews`

Отзывы клиентов на ресторан.

- Фильтр по рейтингу (`RatingFilterChip`)
- Карточки отзывов (`ReviewCard`) с рейтингом, текстом, датой
- **Стор**: `useOrderReviewsStore()`

---

## Меню (`src/views/client/menu/`)

### MenuView.vue — `/client/menu`

Главная страница меню.

- Вкладки: активные / неактивные блюда
- Список категорий с фильтрацией по чипам (`MenuCategoryChip`)
- Карточки блюд (`MenuDishCard`)
- Кнопка добавления блюда
- **Стор**: `useMenuStore()`

---

### MenuSearchView.vue — `/client/menu/search`

Поиск по меню. Живой поиск с debounce по названию блюда.

---

### MenuCategoryListView.vue — `/client/menu/categories`

Управление категориями меню. Добавление, переименование, удаление категорий.

- **Стор**: `useMenuCategoriesStore()`

---

### MenuCategoryView.vue — `/client/menu/categories/:categoryId`

Список блюд в конкретной категории. Возможность смены порядка, перехода к редактированию.

---

### MenuDishView.vue — `/client/menu/items/new` и `/client/menu/items/:itemId`

Форма создания/редактирования блюда.

- Поля: название, описание, цена, категория, статус
- Загрузка фото блюда
- Один компонент для создания и редактирования (определяется по наличию `itemId`)

---

### MenuProductView.vue

Просмотр детальной страницы продукта/блюда.
