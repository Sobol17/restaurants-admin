<script setup>
const model = defineModel({
  type: String,
  default: '',
})
</script>

<template>
  <div class="ready-time-input">
    <input
      v-model="model"
      class="ready-time-input__field"
      type="text"
      placeholder="Напишите минуты"
      inputmode="numeric"
    >
    <span class="ready-time-input__suffix">Мин</span>
  </div>
</template>

<style scoped lang="scss">
.ready-time-input {
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 12px;
  padding: 10px 12px;
  gap: 10px;
  border: 1px solid #ededed;
}

.ready-time-input__field {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #2c2c2c;
}

.ready-time-input__field::placeholder {
  color: #b5b5b5;
}

.ready-time-input__suffix {
  padding-left: 12px;
  border-left: 1px solid #e0e0e0;
  font-size: 14px;
  color: #2c2c2c;
}
</style>
