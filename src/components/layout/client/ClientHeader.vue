<script setup>
defineProps({
  title: String,
  link: String,
  white: Boolean,
})
</script>

<template>
  <div class="header-wrap" :class="{ 'header-wrap--white': white }">
    <div class="header-wrap__inner">
      <RouterLink class="header-wrap__back" :to="link"> Назад</RouterLink>
      <p class="header-wrap__title">{{ title }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-wrap {
  position: sticky;
  top: 0;
  width: calc(100% + 40px);
  margin: 0 -20px;
  padding: 1rem 20px 10px;
  background: var(--black-300, #1e1e1e);
  border-bottom: 1px solid var(--black-400, #111111);
  font-family: 'Lora', serif;

  &--white {
    background: var(--white-bg, #ffffff);
    border: none;
  }

  &__inner {
    position: relative;
    text-align: center;
  }

  &__back {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: var(--text-headline, 20px);
    line-height: 1.3;
  }
}
</style>
