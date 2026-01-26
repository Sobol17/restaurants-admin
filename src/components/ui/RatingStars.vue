<script setup>
import {computed} from 'vue'
import IconStar from '@/components/icons/IconStar.vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 5,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
})

const stars = computed(() => Array.from({length: props.max}, (_, index) => index + 1))

const normalizedValue = computed(() => {
  if (!Number.isFinite(props.value)) {
    return 0
  }
  return Math.max(0, Math.min(props.value, props.max))
})

const sizeValue = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <div
      class="rating-stars"
      :style="{ '--star-size': sizeValue }"
      role="img"
      :aria-label="`Рейтинг ${normalizedValue} из ${max}`"
  >
    <IconStar
        v-for="star in stars"
        :key="star"
        class="rating-stars__icon"
        :class="{ 'rating-stars__icon--active': star <= normalizedValue }"
    />
  </div>
</template>

<style scoped lang="scss">
.rating-stars {
  --star-active: #FDBA2D;
  --star-inactive: #E4E4E4;

  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.rating-stars__icon {
  width: var(--star-size);
  height: var(--star-size);
  color: var(--star-inactive);
}

.rating-stars__icon--active {
  color: var(--star-active);
}
</style>
