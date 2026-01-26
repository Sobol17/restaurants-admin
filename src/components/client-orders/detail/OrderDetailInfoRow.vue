<script setup>
import {computed} from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  meta: String,
})

const baseUrl = import.meta.env.BASE_URL || '/'
const withBase = (path) => `${baseUrl}${path.replace(/^\//, '')}`

const iconUrl = computed(() => {
  const paths = {
    document: withBase('/icons/order-fill.svg'),
    clock: withBase('/icons/time-filled.svg'),
    payment: withBase('/icons/money-bag.svg'),
    location: withBase('/icons/location.svg'),
    phone: withBase('/icons/phone.svg'),
  }

  return paths[props.icon] || paths.document
})
</script>

<template>
  <div class="order-info-row">
    <span class="order-info-row__icon">
      <img :src="iconUrl" alt="" aria-hidden="true">
    </span>
    <div class="order-info-row__content">
      <span class="order-info-row__text">{{ text }}</span>
      <span v-if="meta" class="order-info-row__meta">{{ meta }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.order-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #2c2c2c;
}

.order-info-row__icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.order-info-row__icon img {
  width: 18px;
  height: 18px;
  display: block;
}

.order-info-row__content {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.order-info-row__meta {
  color: #9b9b9b;
  font-size: 13px;
}
</style>
