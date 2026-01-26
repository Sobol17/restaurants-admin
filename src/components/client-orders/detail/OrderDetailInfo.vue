<script setup>
import OrderDetailInfoRow from '@/components/client-orders/detail/OrderDetailInfoRow.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="order-info">
    <OrderDetailInfoRow
      v-for="item in items"
      :key="item.id"
      :icon="item.icon"
      :text="item.text"
      :meta="item.meta"
    />
  </div>
</template>

<style scoped lang="scss">
.order-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
