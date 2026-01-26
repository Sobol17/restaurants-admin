<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  active: Boolean,
})

const emit = defineEmits(['select'])
</script>

<template>
  <button type="button" class="menu-chip" :class="{ 'menu-chip--active': active }" @click="emit('select')">
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-chip {
  border: 1px solid #e6e6e6;
  background-color: #ffffff;
  color: #5f5f5f;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-chip--active {
  background-color: $color-accent;
  border-color: $color-accent;
  color: #fff;
}
</style>
