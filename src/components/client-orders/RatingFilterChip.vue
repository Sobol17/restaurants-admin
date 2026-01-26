<script setup>
import IconStar from '@/components/icons/IconStar.vue'

defineProps({
  label: {
    type: [String, Number],
    required: true,
  },
  active: Boolean,
  showStar: Boolean,
})

const emit = defineEmits(['click'])
</script>

<template>
  <button type="button" class="rating-chip" :class="{ 'rating-chip--active': active }" @click="emit('click')">
    <span class="rating-chip__label">{{ label }}</span>
    <IconStar v-if="showStar" class="rating-chip__icon"/>
  </button>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.rating-chip {
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background-color: $color-bg-muted;
  color: #2c2c2c;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.rating-chip__icon {
  width: 14px;
  height: 14px;
}

.rating-chip:hover {
  background-color: $color-accent;
  color: #fff;
}

.rating-chip--active {
  background-color: $color-accent;
  color: #fff;
}
</style>
