<script setup>
import {computed} from "vue";
import IconSearch from "@/components/icons/IconSearch.vue";

const props = defineProps({
  buttonText: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    required: true,
  },
  error: Boolean,
  disabled: Boolean,
  search: Boolean,
  suffix: String,
});

const model = defineModel();
const labelText = computed(() => props.label || props.placeholder || "");
const inputPlaceholder = computed(() => (props.label ? (props.placeholder || "") : ""));
const isFilled = computed(
    () => model.value !== null && model.value !== undefined && model.value !== ""
);
</script>

<template>
  <div class="input-wrapper">
    <div
        class="input"
        :class="{ 'input--error': error, 'input--disabled': disabled, 'input--filled': isFilled }"
    >
      <div class="input__row">
        <input
            :id="name"
            class="input__field"
            :type="type"
            :placeholder="inputPlaceholder"
            :name="name"
            v-model="model"
            :disabled="disabled"
        />
        <span v-if="suffix" class="input__suffix">{{ suffix }}</span>
        <IconSearch v-if="search" class="input__icon"/>
      </div>
      <label v-if="labelText" class="input__label" :for="name">
        {{ labelText }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: block;
  position: relative;
}

.input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 10px 16px 12px;
  position: relative;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.input:focus-within {
  border-color: #d5d5d5;
  background-color: #f7f7f7;
}

.input__label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  line-height: 1.2;
  color: #b0b0b0;
  cursor: text;
  transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  z-index: 1;
}

.input__row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.input__field {
  flex: 1;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  border: none;
  padding: 0;
  outline: none;
  width: 100%;
  color: #0c0c0d;
}

.input__field::placeholder {
  color: #b0b0b0;
}

.input__field::-webkit-inner-spin-button,
.input__field::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

.input__field[type="number"] {
  -moz-appearance: textfield;
}

.input__suffix {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  padding-left: 12px;
  border-left: 1px solid #e0e0e0;
  color: #0c0c0d;
  font-size: 16px;
  font-weight: 500;
}

.input__icon {
  display: inline-flex;
}

.input--filled .input__label,
.input:focus-within .input__label {
  top: -7px;
  transform: translateY(0);
  font-size: 12px;
}

.input--error {
  border-color: #e51414;
}

.input--error .input__label,
.input--error .input__field,
.input--error .input__suffix {
  color: #e51414;
}

.input--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input--disabled .input__field {
  cursor: not-allowed;
}
</style>
