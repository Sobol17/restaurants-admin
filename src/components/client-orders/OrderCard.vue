<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import OrderReadyTimeModal from '@/components/client-orders/detail/OrderReadyTimeModal.vue'
import { getImagePath } from '@/utils/getImagePath'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientOrdersStore } from '@/stores/client/orders'

const props = defineProps({
  status: {
    type: String,
    default: 'Не назначен',
  },
  statusCode: {
    type: String,
    default: null,
  },
  orderId: {
    type: [Number, String],
    default: null,
  },
  price: {
    type: [Number, String],
    default: 2520,
  },
  items: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Pepperoni\nCheese Pizza',
        image: 'https://placehold.co/120x120?text=Pizza',
      },
      {
        id: 2,
        title: 'Pepperoni\nCheese Pizza',
        image: 'https://placehold.co/120x120?text=Pizza',
      },
      {
        id: 3,
        title: 'Pepperoni\nCheese Pizza',
        image: 'https://placehold.co/120x120?text=Pizza',
      },
    ],
  },
  orderNumber: {
    type: String,
    default: '00001',
  },
  orderTime: {
    type: String,
    default: '12:54, 12 ноября 2025 года',
  },
  payment: {
    type: String,
    default: 'Оплата наличными',
  },
  address: {
    type: String,
    default: 'Ул. Гоголя, д.24, кв. 45',
  },
  note: {
    type: String,
    default: 'Домофон находится со стороны аптеки',
  },
})

const router = useRouter()
const ordersStore = useClientOrdersStore()
const readyTimeOpen = ref(false)
const readyMinutes = ref('')

const isNew = computed(() =>
  props.statusCode
    ? props.statusCode === 'ACCEPTED_BY_RESTAURANT'
    : props.status === 'Не назначен',
)

const isCooking = computed(() => props.statusCode === 'COOKING')
const isBusy = computed(() => ordersStore.isUpdating)
const canConfirmReadyTime = computed(() => {
  const minutes = Number(readyMinutes.value)
  return Number.isFinite(minutes) && minutes > 0
})

const setReadyMinutes = (value) => {
  readyMinutes.value = String(value ?? '').replace(/[^\d]/g, '')
}

const readyMinutesProxy = computed({
  get: () => readyMinutes.value,
  set: (value) => setReadyMinutes(value),
})

const openReadyModal = () => {
  if (isBusy.value) {
    return
  }
  readyTimeOpen.value = true
}

const cancelReadyModal = () => {
  readyTimeOpen.value = false
  readyMinutes.value = ''
}

const confirmReadyTime = async () => {
  if (!props.orderId || !canConfirmReadyTime.value || isBusy.value) {
    return
  }

  const success = await ordersStore.updateOrderStatus({
    orderId: props.orderId,
    status: 'COOKING',
    cookTimeMinutes: readyMinutes.value,
    errorMessage: 'Не удалось принять заказ.',
  })

  if (success) {
    cancelReadyModal()
  }
}

const declineOrder = async () => {
  if (!props.orderId || isBusy.value) {
    return
  }

  await ordersStore.updateOrderStatus({
    orderId: props.orderId,
    status: 'CANCELLED',
    errorMessage: 'Не удалось отклонить заказ.',
  })
}

const markOrderReady = async () => {
  if (!props.orderId || isBusy.value) {
    return
  }

  await ordersStore.updateOrderStatus({
    orderId: props.orderId,
    status: 'WAITING_COURIER',
    errorMessage: 'Не удалось обновить статус заказа.',
  })
}

const openOrderDetail = () => {
  if (!props.orderId) {
    return
  }
  const query = props.statusCode ? { status: props.statusCode } : undefined
  router.push({ name: 'client-order-detail', params: { orderId: props.orderId }, query })
}
</script>

<template>
  <article class="order-card" :class="{ 'order-card--new': !isNew }">
    <header class="order-card__head">
      <div class="order-card__status">
        <span class="order-card__dot"></span>
        <span class="order-card__status-text">{{ status }}</span>
      </div>
      <span class="order-card__price">{{ price }}₽</span>
    </header>

    <div class="order-card__body">
      <div class="order-card__items">
        <div v-for="item in items" :key="item.id" class="order-card__item">
          <img
            class="order-card__item-img"
            :src="getImagePath(item.image)"
            :alt="item.title"
          />
          <div class="order-card__item-overlay">
            <span class="order-card__item-title">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <div class="order-card__meta">
        <div class="order-card__meta-row">
          <svg class="order-card__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-13C4.67 20 4 19.33 4 18.5v-13zm4 2a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8zm0 4a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8zm0 4a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H8z"
            />
          </svg>
          <span>{{ orderNumber }}</span>
        </div>
        <div class="order-card__meta-row">
          <svg class="order-card__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 4a8 8 0 1 1-8 8 8.01 8.01 0 0 1 8-8zm.75 4a.75.75 0 0 0-1.5 0v4.2c0 .25.12.48.32.62l2.9 1.95a.75.75 0 1 0 .83-1.25l-2.55-1.7V8z"
            />
          </svg>
          <span>{{ orderTime }}</span>
        </div>
        <div class="order-card__meta-row">
          <svg class="order-card__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6 7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1h1a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h1V7zm2 1h8V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1z"
            />
          </svg>
          <span>{{ payment }}</span>
        </div>
        <div class="order-card__meta-row">
          <svg class="order-card__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a7 7 0 0 1 7 7c0 5.2-7 11-7 11S5 15.2 5 10a7 7 0 0 1 7-7zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
            />
          </svg>
          <span>{{ address }}</span>
        </div>
      </div>

      <p class="order-card__note">{{ note }}</p>

      <div v-if="!isNew" class="order-card__action">
        <AppButton
          v-if="isCooking"
          text="Заказ готов"
          accent
          block
          :disabled="isBusy"
          @click="markOrderReady"
        />
        <AppButton
          v-else
          text="Посмотреть"
          accent
          block
          @click="openOrderDetail"
        />
      </div>
      <div v-else class="order-card__actions">
        <AppButton text="Отклонить" block :disabled="isBusy" @click="declineOrder" />
        <AppButton text="Принять" accent block :disabled="isBusy" @click="openReadyModal" />
      </div>
    </div>
  </article>

  <OrderReadyTimeModal
    v-model="readyMinutesProxy"
    :open="readyTimeOpen"
    :can-confirm="canConfirmReadyTime"
    @confirm="confirmReadyTime"
    @cancel="cancelReadyModal"
  />
</template>

<style scoped lang="scss">
@use '@/assets/layout/colors' as *;

.order-card {
  background-color: $color-bg-muted;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  max-width: 480px;
}

.order-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
}

.order-card__body {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.order-card__status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.order-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #c7c7c7;
}

.order-card--new .order-card__dot {
  background-color: $color-accent;
}

.order-card__price {
  font-size: 16px;
  font-weight: 700;
  color: $color-accent;
}

.order-card__items {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.order-card__items::-webkit-scrollbar {
  display: none;
}

.order-card__item {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 12px;
  overflow: hidden;
  flex: 0 0 auto;
  background-color: #f3f3f3;
}

.order-card__item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-card__item-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 6px 6px 8px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.order-card__item-title {
  font-size: 11px;
  line-height: 1.2;
  color: #ffffff;
  white-space: pre-line;
}

.order-card__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #2c2c2c;
}

.order-card__meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-card__icon {
  width: 18px;
  height: 18px;
  color: $color-accent;
  flex-shrink: 0;
}

.order-card__note {
  margin: 0;
  font-size: 13px;
  color: #8c8c8c;
}

.order-card__action {
  padding-top: 4px;
}

.order-card__actions {
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
}
</style>
