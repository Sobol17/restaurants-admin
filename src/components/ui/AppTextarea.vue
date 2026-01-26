<script setup>
import {computed} from "vue";

const props = defineProps({
  label: String,
  placeholder: String,
  name: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    default: 4,
  },
  error: Boolean,
  disabled: Boolean,
});

const model = defineModel();
const labelText = computed(() => props.label || props.placeholder || "");
const inputPlaceholder = computed(() => (props.label ? (props.placeholder || "") : ""));
const isFilled = computed(
    () => model.value !== null && model.value !== undefined && model.value !== ""
);
</script>

<template>
  <div class="textarea" :class="{ 'textarea--error': error, 'textarea--filled': isFilled }">
    <textarea
        :id="name"
        class="textarea__field"
        :name="name"
        :rows="rows"
        :placeholder="inputPlaceholder"
        v-model="model"
        :disabled="disabled"
    ></textarea>
    <label v-if="labelText" class="textarea__label" :for="name">
      {{ labelText }}
    </label>
  </div>
</template>

<style scoped>
.textarea {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 14px;
  padding: 14px 16px 12px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.textarea:focus-within {
  border-color: #d5d5d5;
  background-color: #f7f7f7;
}

.textarea__field {
  width: 100%;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #0c0c0d;
  padding: 8px 0 0;
}

.textarea__field::placeholder {
  color: transparent;
}

.textarea__label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #b0b0b0;
  transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  pointer-events: none;
}

.textarea--filled .textarea__label,
.textarea:focus-within .textarea__label {
  top: -7px;
  transform: translateY(0);
  font-size: 12px;
}

.textarea--error {
  border-color: #e51414;
}

.textarea--error .textarea__label,
.textarea--error .textarea__field {
  color: #e51414;
}
</style>
