# Сервисы (TanStack Query)

Файлы: `src/services/`

Сервисный слой оборачивает API-функции в хуки TanStack Vue Query (`useQuery`, `useMutation`). Здесь происходят: кэширование, нормализация данных, инвалидация кэша.

## Query Keys

**`src/services/queryKeys.js`**

Фабрика ключей для TanStack Query. Структура позволяет инвалидировать как всё дерево (`keys.all`), так и конкретный список или элемент.

```js
authKeys = {
  all: ['auth']
}

adsKeys = {
  all: ['ads'],
  lists: () => [...adsKeys.all, 'list'],
  list: (filters) => [...adsKeys.lists(), { filters }],
  details: () => [...adsKeys.all, 'detail'],
  detail: (id) => [...adsKeys.details(), id]
}

// Аналогично: customersKeys, couriersKeys, restaurantsKeys, ordersKeys
```

---

## useMutationWithInvalidate

**`src/services/useMutationWithInvalidate.js`**

Обёртка над `useMutation`, которая автоматически инвалидирует указанные ключи кэша при успехе мутации.

```js
useMutationWithInvalidate(mutationFn, queryKeysToInvalidate, options)
```

Используется во всех сервисах для create/update/delete операций.

---

## useAuth

**`src/services/useAuth.js`**

```js
const { loginMutation, registerMutation } = useAuthApi(options)
```

- `loginMutation` — при успехе записывает токен и метаданные в auth store, редиректит по роли
- `registerMutation` — регистрация нового пользователя

**Маппинг роль → роут:**

| Роль | Маршрут |
|------|---------|
| `restaurant_owner` | `/client/profile` |
| `admin` | `/admin/dashboard` |
| `manager` | `/admin/dashboard` |

---

## useRestaurants

**`src/services/useRestaurants.js`**

```js
const { getList, create, update, updateImages, deleteElement } = useRestaurantsApi()
```

| Хук | Тип | Описание |
|-----|-----|---------|
| `getList()` | `useQuery` | Список ресторанов с нормализацией |
| `create(options)` | `useMutation` | Создать ресторан, инвалидирует `restaurantsKeys.lists()` |
| `update(options)` | `useMutation` | Обновить данные ресторана |
| `updateImages(options)` | `useMutation` | Обновить изображения (FormData) |
| `deleteElement(options)` | `useMutation` | Удалить ресторан |

**Нормализация** (`mapRestaurant`): преобразует snake_case API-ответ в camelCase объект с понятными именами полей.

---

## useOrders

**`src/services/useOrders.js`**

```js
const { getList } = useOrdersApi()
const { data } = getList(filters)
```

- `getList(filters)` — `useQuery`, принимает реактивный объект фильтров
- Нормализует сложную вложенную структуру: заказ → позиции → блюдо → категория → отзыв

---

## useCustomers

**`src/services/useCustomers.js`**

```js
const { getList, create, update, deleteElement } = useCustomersApi()
```

| Хук | Тип |
|-----|-----|
| `getList()` | `useQuery` — список пользователей |
| `create(options)` | `useMutation` |
| `update(options)` | `useMutation` |
| `deleteElement(options)` | `useMutation` |

---

## useCouriers

**`src/services/useCouriers.js`**

```js
const { getList } = useCouriersApi()
```

Только чтение. `getList()` — `useQuery` со списком курьеров.

---

## useAds

**`src/services/useAds.js`**

```js
const { getList, create, update, deleteElement } = useAdsApi()
```

| Хук | Тип |
|-----|-----|
| `getList()` | `useQuery` |
| `create(options)` | `useMutation` |
| `update(options)` | `useMutation` |
| `deleteElement(options)` | `useMutation` |

---

## Паттерн использования в компонентах

```vue
<script setup>
import { useRestaurantsApi } from '@/services/useRestaurants'

const { getList, create } = useRestaurantsApi()
const { data: restaurants, isLoading } = getList()

const createMutation = create({
  onSuccess: () => toast.add({ severity: 'success', summary: 'Создано' })
})

function submit(payload) {
  createMutation.mutate(payload)
}
</script>
```
