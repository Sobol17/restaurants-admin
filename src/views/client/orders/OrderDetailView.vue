<script setup>
import OrderDetailActions from '@/components/client-orders/detail/OrderDetailActions.vue'
import OrderDetailComment from '@/components/client-orders/detail/OrderDetailComment.vue'
import OrderDetailInfo from '@/components/client-orders/detail/OrderDetailInfo.vue'
import OrderDetailItems from '@/components/client-orders/detail/OrderDetailItems.vue'
import OrderDetailSummary from '@/components/client-orders/detail/OrderDetailSummary.vue'
import OrderReadyTimeModal from '@/components/client-orders/detail/OrderReadyTimeModal.vue'
import { useNavigationStore } from '@/stores/client/navigation'
import { useOrderDetailStore } from '@/stores/client/orderDetail'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

const navStore = useNavigationStore()
const { changeTitle, changeBackLinkVisible } = navStore

changeTitle('Детали заказа')
changeBackLinkVisible(true)

onBeforeUnmount(() => {
  changeBackLinkVisible(false)
})

const orderStore = useOrderDetailStore()
const {
  order,
  infoRows,
  isReadyTimeModalOpen,
  readyMinutes,
  statusLabel,
  statusTone,
  actionState,
  canConfirmReadyTime,
} = storeToRefs(orderStore)
const {
  setOrderId,
  setStatusCode,
  setReadyMinutes,
  cancelReadyTime,
  confirmReadyTime,
  loadOrder,
  triggerPrimaryAction,
  triggerSecondaryAction,
} = orderStore

const route = useRoute()
const syncRoute = () => {
  const orderIdParam = Array.isArray(route.params.orderId)
    ? route.params.orderId[0]
    : route.params.orderId
  const statusParam = Array.isArray(route.query.status)
    ? route.query.status[0]
    : route.query.status

  setOrderId(orderIdParam)
  if (statusParam) {
    setStatusCode(statusParam)
  }
  if (orderIdParam) {
    loadOrder()
  }
}

watch(() => [route.params.orderId, route.query.status], syncRoute, {
  immediate: true,
})

const readyMinutesProxy = computed({
  get: () => readyMinutes.value,
  set: value => setReadyMinutes(value),
})
</script>

<template>
  <main class="order-detail">
    <section class="order-detail__card">
      <OrderDetailInfo :items="infoRows" />
      <OrderDetailComment :text="order.comment" />
      <!-- <OrderDetailMap/> -->
      <OrderDetailSummary
        :total="order.total"
        :status="statusLabel"
        :tone="statusTone"
      />
      <OrderDetailItems :items="order.items" />
    </section>

    <div class="order-detail__actions">
      <OrderDetailActions
        :config="actionState"
        @primary="triggerPrimaryAction"
        @secondary="triggerSecondaryAction"
      />
    </div>

    <OrderReadyTimeModal
      v-model="readyMinutesProxy"
      :open="isReadyTimeModalOpen"
      :can-confirm="canConfirmReadyTime"
      @confirm="confirmReadyTime"
      @cancel="cancelReadyTime"
    />
  </main>
</template>

<style scoped lang="scss">
.order-detail {
  margin-top: 10px;
  padding: 12px 16px 160px;
  background-color: #fff;
  border-radius: 6px 6px 0 0;
  min-height: calc(100vh - 100px);
}

.order-detail__card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-detail__actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px 24px;
  background: #fff;
  box-shadow: 0px -8px 8px 0px rgba(0, 0, 0, 0.06);
}

@media (min-width: 768px) {
  .order-detail__actions {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(480px, 100%);
    border-radius: 12px 12px 0 0;
  }
}
</style>
