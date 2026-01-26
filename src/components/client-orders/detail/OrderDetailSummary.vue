<script setup>
import {computed} from 'vue'

const props = defineProps({
  total: {
    type: [Number, String],
    default: 0,
  },
  status: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'muted',
  },
})

const statusClass = computed(() => `order-summary__status--${props.tone}`)
</script>

<template>
  <div class="order-summary">
    <div class="order-summary__row">
      <span class="order-summary__label">Сумма заказа</span>
      <span class="order-summary__value">{{ total }}₽</span>
    </div>
    <div class="order-summary__row">
      <span class="order-summary__label">Статус заказа</span>
      <span class="order-summary__status" :class="statusClass">
        <span class="order-summary__dot"></span>
        <span>{{ status }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding-bottom: 12px;

  &:not(&:last-child) {
    border-bottom: 1px solid #efefef;
  }
}

.order-summary__label {
  font-weight: 500;
  font-size: 16px;
}

.order-summary__value {
  font-size: 16px;
  font-weight: 700;
  color: $color-accent;
}

.order-summary__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #2c2c2c;
}

.order-summary__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #c7c7c7;
}

.order-summary__status--success .order-summary__dot {
  background-color: #2f9e5f;
}

.order-summary__status--danger .order-summary__dot {
  background-color: $color-danger;
}
</style>
