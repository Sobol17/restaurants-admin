<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="schedule-time" :class="{ 'schedule-time--disabled': disabled }">
    <span class="schedule-time__label">{{ label }}</span>
    <input
      class="schedule-time__input"
      type="time"
      step="300"
      :value="modelValue"
      :disabled="disabled"
      @input="handleInput"
      @change="handleInput"
    />
  </div>
</template>

<style scoped>
.schedule-time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.schedule-time__label {
  font-size: 12px;
  color: #9a9a9a;
}

.schedule-time__input {
  min-width: 74px;
  padding: 6px 22px 6px 10px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background-color: #f4f4f4;
  height: 30px;
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
  text-align: center;
  cursor: pointer;
}

.schedule-time__input:disabled {
  cursor: not-allowed;
}

.schedule-time__input::-webkit-calendar-picker-indicator {
  opacity: 0.35;
}

.schedule-time--disabled {
  opacity: 0.6;
}
</style>
