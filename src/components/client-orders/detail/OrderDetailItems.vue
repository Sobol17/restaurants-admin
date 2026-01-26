<script setup>
import OrderDetailItemCard from '@/components/client-orders/detail/OrderDetailItemCard.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="order-items">
    <h2 class="order-items__title">Список блюд</h2>
    <div class="order-items__list">
      <OrderDetailItemCard
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          :image="item.image"
          large
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.order-items__title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
}

.order-items__list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.order-items__list::-webkit-scrollbar {
  display: none;
}
</style>
