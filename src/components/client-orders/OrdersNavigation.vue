<script setup>
import OrdersNavigationCard from '@/components/client-orders/OrdersNavigationCard.vue'
import { useOrderReviewsStore } from '@/stores/client/orderReviews'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const reviewsStore = useOrderReviewsStore()
const { reviewsCount } = storeToRefs(reviewsStore)
const { loadReviews } = reviewsStore

onMounted(loadReviews)
</script>

<template>
  <div class="orders-nav">
    <OrdersNavigationCard
      icon-url="/front/icons/analytics.svg"
      label="Аналитика ресторана"
      link="orders/analytics"
    />
    <div class="orders-nav__row">
      <OrdersNavigationCard
        icon-url="/front/icons/orders-history.svg"
        label="История заказов"
        link="orders/history"
      />
      <OrdersNavigationCard
        icon-url="/front/icons/reviews.svg"
        label="Отзывы"
        :count="reviewsCount"
        link="orders/reviews"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders-nav {
  margin-top: 16px;

  &__row {
    margin-top: 10px;
    display: flex;
    width: 100%;
    column-gap: 10px;
  }
}
</style>
