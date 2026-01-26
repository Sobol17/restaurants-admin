<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="menu-tabs">
    <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="menu-tabs__button"
        :class="{ 'menu-tabs__button--active': tab.id === activeId }"
        @click="emit('change', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-tabs {
  display: flex;
  gap: 6px;
  padding: 4px;
  background-color: #f1f1f1;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e6e6e6;
}

.menu-tabs__button {
  border: none;
  flex: 1;
  padding: 8px 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background-color: transparent;
  color: #b6b8b5;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-tabs__button--active {
  background-color: #fff;
  color: #2c2c2c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
