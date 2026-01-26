<script setup>
defineProps({
  title: [String, Number],
  subtitle: String,
})
</script>

<template>
  <div class="info-card">
    <div class="info-card__top">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="info-card__bottom">{{ subtitle }}</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.info-card {
  border-radius: 12px;
  background-color: $color-bg-muted;
  padding: 14px;
  display: flex;
  flex-direction: column;
  height: 94px;
  width: 100%;

  &__top {
    color: $color-accent;
    font-size: 20px;
    font-weight: 600;
  }

  &__bottom {
    font-size: 14px;
    font-weight: 600;
    margin-top: auto;
  }
}
</style>
