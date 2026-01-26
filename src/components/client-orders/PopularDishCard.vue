<script setup>
import IconAngleRight from '@/components/icons/IconAngleRight.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  orders: {
    type: [Number, String],
    required: true,
  },
})
</script>

<template>
  <button type="button" class="popular-dish">
    <div class="popular-dish__meta">
      <div class="popular-dish__title">{{ title }}</div>
      <div class="popular-dish__count">{{ orders }} заказов</div>
    </div>
    <IconAngleRight class="popular-dish__icon"/>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.popular-dish {
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: $color-bg-muted;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
}

.popular-dish:hover {
  background-color: #ebefea;
}

.popular-dish__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popular-dish__title {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.popular-dish__count {
  font-size: 12px;
  color: $color-accent;
  font-weight: 600;
}

.popular-dish__icon {
  width: 18px;
  height: 18px;
  color: #b6b8b5;
}
</style>
