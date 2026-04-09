# Aidoo Admin — Документация

Административная панель для платформы управления ресторанами. SPA на Vue 3, разворачивается на GitHub Pages.

## Содержание

- [Архитектура](./architecture.md) — общая структура, паттерны, стек
- [Маршрутизация](./routing.md) — роутер, guards, структура URL
- [API слой](./api.md) — axios-клиент, все эндпоинты
- [Сервисы (TanStack Query)](./services.md) — хуки данных, query keys, мутации
- [Pinia сторы](./stores.md) — состояние приложения
- [Компоненты](./components.md) — UI-компоненты, layout, иконки
- [Представления (Views)](./views.md) — страницы admin и client интерфейсов

## Быстрый старт

```bash
npm install
npm run dev        # Dev-сервер (Vite, http://localhost:5173)
npm run build      # Продакшн сборка в dist/
npm run preview    # Превью продакшн-сборки
npm run lint       # Линтинг + автоформатирование (ESLint + Prettier)
npm run deploy     # Деплой на GitHub Pages (gh-pages -d dist)
```

## Технологический стек

| Категория       | Технология                        |
|----------------|-----------------------------------|
| Фреймворк       | Vue 3 (Composition API)           |
| Сборщик         | Vite 5                            |
| Маршрутизация   | Vue Router 4                      |
| Состояние       | Pinia 3                           |
| Серверный стейт | TanStack Vue Query 5              |
| UI библиотека   | PrimeVue 4                        |
| Стили           | Tailwind CSS + SCSS + PrimeUI     |
| HTTP клиент     | Axios                             |
| Деплой          | GitHub Pages (`/front/` base path)|

## Два интерфейса

Приложение имеет **два полностью отдельных UI** в одном SPA:

| Интерфейс | Маршрут | Роль | Назначение |
|-----------|---------|------|-----------|
| **Admin** | `/admin/*` | admin, manager | Управление ресторанами, пользователями, курьерами, заказами, рекламой |
| **Client** | `/client/*` | restaurant_owner | Меню, заказы, профиль ресторана, аналитика |

## Переменные окружения

Нет отдельного `.env` файла — URL бэкенда захардкожен в `src/api/axios.instance.js`:

```
https://admin.daimfood.ru/
```

## Деплой

- Base path: `/front/` (настроен в `vite.config.mjs`)
- `npm run deploy` — билдит и пушит `dist/` в ветку `gh-pages`
