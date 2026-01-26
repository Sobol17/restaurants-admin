<script setup>
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({variant: 'none'}),
  },
})

const emit = defineEmits(['primary', 'secondary'])

const handlePrimary = () => {
  emit('primary')
}

const handleSecondary = () => {
  emit('secondary')
}
</script>

<template>
  <div class="order-actions">
    <template v-if="config.variant === 'double'">
      <AppButton
        class="order-actions__button"
        :text="config.secondaryLabel"
        block
        @click="handleSecondary"
      />
      <AppButton
        class="order-actions__button"
        :text="config.primaryLabel"
        accent
        block
        @click="handlePrimary"
      />
    </template>

    <template v-else-if="config.variant === 'single'">
      <AppButton
        :text="config.label"
        accent
        block
        :disabled="config.disabled"
        @click="handlePrimary"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.order-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.order-actions__button {
  flex: 1;
}
</style>
