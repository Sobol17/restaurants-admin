<script setup>
import { getImagePath } from '@/utils/getImagePath'

defineProps({
  title: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  large: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="order-item-card" :class="{ 'order-item-card--lg': large }">
    <div class="order-item-card__image-wrap">
      <img
        class="order-item-card__image"
        :src="getImagePath(image)"
        :alt="title"
      />
    </div>
    <div class="order-item-card__title">{{ title }}</div>
  </div>
</template>

<style scoped lang="scss">
.order-item-card {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 0 0 auto;

  &--lg {
    width: 174px;
  }
}

.order-item-card__image-wrap {
  border-radius: 16px;
  overflow: hidden;
  background: #f1f1f1;
  height: 110px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.order-item-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.order-item-card__title {
  font-size: 12px;
  color: #3a3a3a;
  line-height: 1.2;
}
</style>
