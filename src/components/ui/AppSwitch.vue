<script setup>
import {computed} from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  id: String,
  name: String,
});

const emit = defineEmits(["update:modelValue", "change"]);

const checked = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
    emit("change", value);
  },
});
</script>

<template>
  <label class="app-switch">
    <input
        :id="id"
        :name="name"
        type="checkbox"
        v-model="checked"
        :disabled="disabled"
    />
    <span class="app-switch__track"></span>
  </label>
</template>

<style scoped>
.app-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 50px;
  height: 26px;
  cursor: pointer;
}

.app-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.app-switch__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background-color: #e6e6e6;
  transition: background-color 0.2s ease;
}

.app-switch__track::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease;
}

.app-switch input:checked + .app-switch__track {
  background-color: #ff8a2a;
}

.app-switch input:checked + .app-switch__track::before {
  transform: translateX(24px);
}

.app-switch input:disabled + .app-switch__track {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
