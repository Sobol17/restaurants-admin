# Компоненты

Файлы: `src/components/`

Все компоненты из `src/components/` авто-импортируются через `unplugin-vue-components` — явные `import` в `<script setup>` не нужны.

---

## UI примитивы (`src/components/ui/`)

Базовые переиспользуемые элементы интерфейса.

| Компонент | Описание |
|-----------|---------|
| `AppButton.vue` | Кнопка (обёртка или кастомная) |
| `AppCheckbox.vue` | Чекбокс |
| `AppInput.vue` | Поле ввода |
| `AppTextarea.vue` | Текстовая область |
| `AppSwitch.vue` | Переключатель (toggle) |
| `AppLoader.vue` | Индикатор загрузки |
| `Datepicker.vue` | Обёртка над PrimeVue DatePicker (с ru-RU локалью) |
| `RatingStars.vue` | Отображение рейтинга 1–5 звёзд |

---

## Общие компоненты

| Компонент | Описание |
|-----------|---------|
| `InfoCard.vue` | Карточка с информацией (иконка + заголовок + текст) |
| `ModalBottom.vue` | Модальная шторка снизу (для мобильного client UI) |

---

## Layout — Admin (`src/components/layout/admin/`)

| Компонент | Описание |
|-----------|---------|
| `AdminLayout.vue` | Корневой layout для `/admin/*`: topbar + sidebar + slot контента |
| `AdminTopbar.vue` | Верхняя панель: логотип, кнопка меню, профиль |
| `AdminSidebar.vue` | Боковое меню навигации |
| `AdminMenu.vue` | Список пунктов меню |
| `AdminMenuItem.vue` | Один пункт меню (с иконкой, вложенностью) |
| `AdminFooter.vue` | Нижний колонтитул |
| `AdminConfigurator.vue` | Панель настройки темы (тёмная/светлая) |
| `composables/layout.js` | Composable: управление состоянием sidebar (открыт/закрыт, мобильный режим) |

---

## Layout — Client (`src/components/layout/client/`)

| Компонент | Описание |
|-----------|---------|
| `ClientLayout.vue` | Корневой layout для `/client/*`: header + контент + нижняя навигация |
| `ClientHeader.vue` | Шапка: заголовок страницы (из nav store), кнопка "назад" |
| `BottomNavigation.vue` | Нижняя навигация (Profile, Orders, Menu) |

---

## Профиль (`src/components/profile/`)

| Компонент | Описание |
|-----------|---------|
| `ProfileRow.vue` | Строка профиля: label + значение (или slot) |
| `PaymentVariant.vue` | Карточка способа оплаты с переключателем |
| `schedule/ScheduleDayCard.vue` | Карточка одного дня расписания (пн, вт, ...) |
| `schedule/ScheduleTimeField.vue` | Поле ввода времени открытия/закрытия |

---

## Меню (`src/components/client-menu/`)

| Компонент | Описание |
|-----------|---------|
| `MenuCategoryChip.vue` | Чип-фильтр категории |
| `MenuDishCard.vue` | Карточка блюда (фото, название, цена, статус) |
| `MenuIconChip.vue` | Иконка-чип для типа блюда |
| `MenuStatusTabs.vue` | Вкладки активные/неактивные |

---

## Заказы (`src/components/client-orders/`)

| Компонент | Описание |
|-----------|---------|
| `OrderCard.vue` | Карточка заказа в списке |
| `CategoriesRow.vue` | Горизонтальная прокрутка категорий-фильтров |
| `FilterChip.vue` | Чип фильтрации |
| `OrdersNavigation.vue` | Навигация по разделам заказов (активные, история, аналитика, отзывы) |
| `OrdersNavigationCard.vue` | Карточка в навигации |
| `HistoryCard.vue` | Карточка в истории заказов |
| `PopularDishCard.vue` | Карточка популярного блюда (аналитика) |
| `ReviewCard.vue` | Карточка отзыва |
| `RatingFilterChip.vue` | Чип фильтра по рейтингу |

### Детали заказа (`src/components/client-orders/detail/`)

| Компонент | Описание |
|-----------|---------|
| `OrderDetailActions.vue` | Кнопки действий (принять, отклонить, готово и т.д.) |
| `OrderDetailComment.vue` | Комментарий к заказу |
| `OrderDetailInfo.vue` | Основная информация заказа |
| `OrderDetailInfoRow.vue` | Строка информации (label + value) |
| `OrderDetailItemCard.vue` | Карточка позиции в заказе |
| `OrderDetailItems.vue` | Список позиций заказа |
| `OrderDetailMap.vue` | Карта с адресом доставки |
| `OrderDetailSummary.vue` | Итоговая сумма, стоимость доставки |
| `OrderReadyTimeInput.vue` | Поле ввода времени готовности |
| `OrderReadyTimeModal.vue` | Модальное окно выбора времени готовности |

---

## Иконки (`src/components/icons/`)

21 кастомная SVG-иконка в виде Vue компонентов:

`IconAngleDown`, `IconArrowLeft`, `IconBag`, `IconBell`, `IconCheck`, `IconClose`, `IconDelete`, `IconEdit`, `IconEye`, `IconFilter`, `IconHome`, `IconList`, `IconLogout`, `IconMap`, `IconMenu`, `IconPhone`, `IconPlus`, `IconSearch`, `IconStar`, `IconUser`, `IconWallet`

Использование:
```vue
<IconEdit />
<IconClose class="text-red-500" />
```
