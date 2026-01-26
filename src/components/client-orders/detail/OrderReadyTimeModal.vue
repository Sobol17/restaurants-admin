<script setup>
import OrderReadyTimeInput from '@/components/client-orders/detail/OrderReadyTimeInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  open: Boolean,
  canConfirm: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])

const model = defineModel({
  type: String,
  default: '',
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="ready-modal">
      <div class="ready-modal__overlay" @click="handleCancel"></div>
      <div class="ready-modal__card">
        <h3 class="ready-modal__title">Вы успешно приняли заказ</h3>
        <div class="ready-modal__label">Время готовности</div>
        <OrderReadyTimeInput v-model="model"/>
        <div class="ready-modal__actions">
          <AppButton text="Отмена" block @click="handleCancel"/>
          <AppButton text="Подтвердить" accent block :disabled="!canConfirm" @click="handleConfirm"/>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.ready-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ready-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}

.ready-modal__card {
  position: relative;
  z-index: 1;
  width: min(340px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 18px 16px 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ready-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #2c2c2c;
}

.ready-modal__label {
  font-size: 13px;
  color: #6e6e6e;
}

.ready-modal__actions {
  display: flex;
  gap: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
