<script setup>
import IconPaymentDelete from "@/components/icons/IconPaymentDelete.vue";
import IconCard from "@/components/icons/IconCard.vue";

defineProps({
  title: String,
  subtitle: String,
})

const emits = defineEmits(['delete'])

const handleDelete = (id) => {
  emits('delete', id)
}
</script>

<template>
  <div class="payment-variant">
            <span class="payment-variant__icon" aria-hidden="true">
              <IconCard/>

            </span>
    <div class="payment-variant__content">
      <div class="payment-variant__title">{{ title }}</div>
      <div class="payment-variant__subtitle">{{ subtitle }}</div>
    </div>
    <button @click="handleDelete" class="payment-variant__delete" type="button" aria-label="Удалить">
      <IconPaymentDelete/>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.payment-variant {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  gap: 12px;
  align-items: center;
  background-color: $color-bg-muted;
  border-radius: 12px;
  padding: 12px 14px;
}

.payment-variant__title {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.payment-variant__subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: #9a9a9a;
}

.payment-variant__delete {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  color: $color-danger;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>