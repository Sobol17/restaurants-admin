<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  activeId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['select']);

const handleClick = (id) => {
  emit('select', id);
};
</script>

<template>
  <div class="categories-row">
    <div
        v-for="category in categories"
        :key="category.id"
        @click="handleClick(category.id)"
        class="category-item"
        :class="{'category-item--active': category.id === activeId}"
    >
      {{ category.label }} ({{ category.count }})
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.categories-row {
  display: flex;
  column-gap: 10px;
  overflow-x: auto;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.category-item {
  cursor: pointer;
  width: fit-content;
  border-radius: 300px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 400;
  background-color: $color-bg-muted;
  white-space: nowrap;

  &--active {
    background-color: $color-accent;
    color: #fff;
  }
}
</style>
