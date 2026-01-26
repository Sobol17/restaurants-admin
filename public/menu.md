Api эндпоинты для работы экраном menu

При заходе на экран MenuView.vue необходимо получать категории ресторана.
После этого получать блюда в конкретной категории.
На экране есть вкладки "Активные" и "Неактивные". Это группировка, которая делается по полю is_paused из объекта блюда

1) Получение категорий GET
   /restaurants/categories?restaurant_id
   Get Restaurant Dish Categories

Тело ответа

```
]
  {
    "id": 0,
    "name": "string",
    "restaurant_id": 0,
    "dishes_count": 0
  }
]
```

2) Получение блюд в категории GET
   /restaurants/categories/dishes?restaurant_id?category_id
   Get Dishes By Category

Тело ответа

```
[
  {
    "id": 0,
    "restaurant_id": 0,
    "name": "string",
    "price": 0,
    "description": "string",
    "images_urls": [
      "string"
    ],
    "category": {
      "id": 0,
      "name": "string",
      "image_url": "string"
    },
    "is_paused": true
  }
]
```

3) Получение подсказок для поиска GET
   /restaurants/hints?restaurant_id
   Get Hints For Search

Тело ответа

```
[
  "string"
]
```

4) Добавление нового блюда. POST
   /restaurants/menu/add
   Add Dish To Restaurant Menu

Тело запроса

```
{
  "name": "string",
  "price": 0,
  "description": "string",
  "category_id": 0,
  "is_paused": false
}
```

5) Добавление изображений блюда. POST
   /restaurants/menu/images/add?dish_id
   Add Images To Dish In Restaurant Menu

Массив изображение FormData

```
array<string>
```

6) Редактирование блюда. POST
   /restaurants/menu/update
   Update Dish In Restaurant Menu

```
{
  "id": 0,
  "name": "string",
  "price": 0,
  "description": "string",
  "category_id": 0,
  "is_paused": true
}
```

7) Удаление блюда. POST
   /restaurants/menu/remove?dish_id
   Remove Dish In Restaurant Menu

```
```

8) Получение блюда. GET
   /restaurants/dish
   Get Restaurant Dish By Id

```
{
  "id": 0,
  "restaurant_id": 0,
  "name": "string",
  "price": 0,
  "description": "string",
  "images_urls": [
    "string"
  ],
  "category": {
    "id": 0,
    "name": "string",
    "image_url": "string"
  },
  "is_paused": true
}
```

9) Добавление новой категории. POST
   /restaurants/menu/category/add?name
   Add Dish Category To Restaurant

```

```

10) Обновление категории POST
    /restaurants/menu/category/update
    Update Dish Category To Restaurant

```
{
  "id": 0,
  "name": "string"
}
```

11) Обновить изображения POST
    /restaurants/menu/category/update/image?category_id
    Update Dish Category Image In Restaurant
    FormData

```
image
```

12) Удалить категорию POST
    /restaurants/menu/category/remove?category_id
    Remove Dish Category From Restaurant

```
```