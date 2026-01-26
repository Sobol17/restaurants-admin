<script setup>
const emit = defineEmits(['click'])
</script>

<template>
  <button type="button" class="menu-icon-chip" @click="emit('click')">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-icon-chip {
  border: 1px solid #e6e6e6;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #2c2c2c;
  cursor: pointer;
}
</style>
