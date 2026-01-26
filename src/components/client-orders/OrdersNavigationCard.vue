<script setup>
defineProps({
  iconUrl: String,
  link: String,
  label: String,
  count: Number,
})
</script>

<template>
  <RouterLink class="nav-card" :to="link">
    <div class="nav-card__head">
      <img :src="iconUrl" class="nav-card__icon" alt="">
      <p v-if="count" class="nav-card__count">+{{ count }}</p>
    </div>
    <div class="nav-card__label">{{ label }}</div>
  </RouterLink>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.nav-card {
  display: block;
  padding: 14px;
  background-color: $color-bg-muted;
  width: 100%;
  border-radius: 12px;

  &__head {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  &__count {
    font-size: 16px;
    font-weight: 500;
    color: $color-accent;
  }

  &__label {
    margin-top: 14px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>