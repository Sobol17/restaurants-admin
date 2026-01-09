<template>
  <label class="apple-switch">
    <input
      type="checkbox"
      v-model="isChecked"
      @change="handleChange"
    />
    <span class="slider"></span>
  </label>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const isChecked = ref(props.modelValue);

const handleChange = () => {
  emit('update:modelValue', isChecked.value);
  emit('change', isChecked.value);
};
</script>

<style scoped>
.apple-switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.apple-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.24s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #689675;
}

input:checked + .slider:before {
  transform: translateX(18px);
}
</style>