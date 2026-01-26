<script setup>
import IconAngleDown from "@/components/icons/IconAngleDown.vue";

defineProps({
  label: String,
  active: Boolean,
})

const emits = defineEmits(['change'])

const handleChange = () => {
  emits('change')
}
</script>

<template>
  <div @click="handleChange" class="chip" :class="{'chip--active': active}">
    <p>{{ label }}</p>
    <IconAngleDown/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.chip {
  display: flex;
  column-gap: 4px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 300px;
  background-color: $color-bg-muted;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background-color: $color-accent;
  }

  &--active {
    color: #fff;
    background-color: $color-accent;
  }
}
</style>