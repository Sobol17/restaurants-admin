<script setup>
defineProps({
  label: {
    type: String,
    default: 'Комментарий',
  },
  text: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="order-comment">
    <div class="order-comment__label">{{ label }}</div>
    <div class="order-comment__text">{{ text }}</div>
  </div>
</template>

<style scoped lang="scss">
.order-comment__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #9b9b9b;
}

.order-comment__text {
  margin-top: 6px;
  background: #f3f3f3;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  color: #3a3a3a;
}
</style>
