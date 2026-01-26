<script setup>
import {computed} from "vue";

const props = defineProps({
  modelValue: {
    type: [Array, Boolean],
    default: false,
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
  label: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue", "change"]);

const isArrayModel = computed(() => Array.isArray(props.modelValue));
const isChecked = computed(() => {
  if (isArrayModel.value) {
    return props.modelValue.includes(props.value);
  }
  return Boolean(props.modelValue);
});

const updateChecked = (checked) => {
  if (isArrayModel.value) {
    const next = [...props.modelValue];
    const index = next.indexOf(props.value);

    if (checked && index === -1) {
      next.push(props.value);
    }

    if (!checked && index !== -1) {
      next.splice(index, 1);
    }

    emit("update:modelValue", next);
    emit("change", next);
    return;
  }

  emit("update:modelValue", checked);
  emit("change", checked);
};

const handleChange = (event) => updateChecked(event.target.checked);
</script>

<template>
  <label class="app-checkbox" :class="{ 'app-checkbox--disabled': disabled }">
    <input
      class="app-checkbox__input"
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="app-checkbox__box" aria-hidden="true"></span>
    <span class="app-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.app-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #2c2c2c;
  cursor: pointer;
  position: relative;
}

.app-checkbox__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.app-checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  background-color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.app-checkbox__input:checked + .app-checkbox__box {
  background-color: #ff8a2a;
  border-color: #ff8a2a;
}

.app-checkbox__input:checked + .app-checkbox__box::after {
  content: "";
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.app-checkbox--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
