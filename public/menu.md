Api эндпоинты для работы отзывами

1) GET
   /restaurants/reviews?restaurent_id
   Get Restaurant Reviews

Тело ответа

```
[
  {
    "id": 0,
    "restaurant_id": 0,
    "customer_id": 0,
    "order_id": 0,
    "rating": 0,
    "comment": "string"
  }
]
```