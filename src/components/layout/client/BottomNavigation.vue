<script setup></script>

<template>
  <div class="bottom-navigation">
    <RouterLink to="/"> 1 </RouterLink>

    <RouterLink to="/"> 2 </RouterLink>

    <RouterLink to="/"> 3 </RouterLink>

    <RouterLink to="/"> 4 </RouterLink>

    <RouterLink to="/"> 5 </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.bottom-navigation {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 45px;
  padding: 1.25rem 2.75rem;
  background: var(--white-bg, #ffffff);
  border-top: 1px solid var(--neutral-200, #e5e5e5);
}
</style>
