# Архитектура

## Обзор

```
src/
├── api/          → Axios-запросы к бэкенду (чистый HTTP)
├── services/     → TanStack Query хуки (кэш, мутации, ключи запросов)
├── stores/       → Pinia (UI-состояние, фильтры, формы)
├── views/        → Компоненты-страницы (цели роутов)
├── components/   → Переиспользуемые компоненты
├── router/       → Vue Router (маршруты + guards)
├── utils/        → Вспомогательные функции
└── assets/       → Стили, шрифты, картинки
```

## Поток данных

```
Бэкенд API
    ↓  HTTP (Axios)
src/api/            ← сырые запросы, без логики
    ↓  вызывается из
src/services/       ← useQuery / useMutation (TanStack Query)
                       нормализация, инвалидация кэша
    ↓  данные доступны в
src/views/          ← страницы читают из сервисов
src/stores/         ← хранят UI-состояние (диалоги, фильтры, черновики форм)
    ↓
src/components/     ← принимают props, эмитят события
```

### Правило разделения слоёв

- **`api/`** — только axios-вызовы. Никакой логики кэша, никаких трансформаций.
- **`services/`** — только TanStack Query. Нормализует ответы (snake_case → camelCase), управляет ключами кэша.
- **`stores/`** — только UI-состояние: открыт ли диалог, текущие фильтры, черновик редактируемой формы. Не дублирует серверные данные.
- **`views/`** — оркестрируют: подключают сервисы и сторы, рендерят компоненты.

## Два режима работы

### Admin (`/admin/*`)

- Desktop-first интерфейс
- Layout: `AdminLayout` = Topbar + Sidebar + контент
- Паттерн CRUD: DataTable PrimeVue + Dialog (создать/редактировать) + подтверждение удаления
- Роли: `admin` (полный доступ), `manager` (dashboard + orders)

### Client (`/client/*`)

- Mobile-first интерфейс
- Layout: `ClientLayout` = Header + BottomNavigation + контент
- Карточный UI, детальные экраны вместо диалогов
- Роль: `restaurant_owner`

## Аутентификация

Токен хранится в `localStorage`:

| Ключ | Содержимое |
|------|-----------|
| `access_token` | Bearer JWT |
| `auth_metadata` | JSON объект с полями `role`, `id` и др. |
| `restaurant_id` | ID ресторана (только для restaurant_owner) |

Axios-интерсептор автоматически добавляет `Authorization: Bearer <token>` к каждому запросу. При 401 — сессия очищается и пользователь перенаправляется на логин.

Также поддерживается инъекция токена через URL: `?token=...&restaurantId=...` — удобно для перехода из внешних систем.

## Авто-импорт компонентов

Настроен `unplugin-vue-components` (в `vite.config.mjs`):
- Все компоненты PrimeVue импортируются автоматически
- Все локальные компоненты из `src/components/` — тоже
- Явные `import` для компонентов в `<script setup>` не нужны

## Path alias

`@/` → `src/`

```js
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
```

## Локализация

Русская локаль (`ru-RU`) настроена в `src/main.js` для PrimeVue (DatePicker, Calendar и др.). Строки интерфейса захардкожены на русском языке — i18n не используется.

## Фото и изображения

Загрузка фото работает через `FormData` + `multipart/form-data`. Утилита `src/utils/usePhotoUtils.js` предоставляет:
- Предпросмотр через `FileReader`
- Хелперы для подготовки `FormData`

Получение URL изображений — через `src/utils/getImagePath.js`.
