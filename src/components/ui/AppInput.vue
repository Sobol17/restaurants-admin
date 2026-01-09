<script setup>
import IconSearch from "@/components/icons/IconSearch.vue";

defineProps({
  buttonText: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  name: {
    type: String,
    required: true,
  },
  error: Boolean,
  disabled: Boolean,
  search: Boolean,
});

const model = defineModel();
</script>

<template>
  <div class="input-wrapper">
    <div class="input">
      <IconSearch v-if="search" class="text-neutral-500 absolute top-1/2 right-3 -translate-y-1/2"/>
      <!--  НЕ УБИРАТЬ placeholder=" "  -->
      <input
          :class="{ 'input--error': error }"
          :type="type"
          placeholder=" "
          :name="name"
          v-model="model"
          :disabled="disabled"
      />
      <label class="input__label" :class="{ 'label--error': error }">{{ placeholder }}</label>
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: block;
  position: relative;
}

.input__label {
  font-size: 16px;
  color: #858585;
  position: absolute;
  top: 14px;
  left: 16px;
  transition: 0.3s;
  cursor: text;
}

.input {
  position: relative;
}

.input input {
  background-color: white;
  font-size: 16px;
  border: 1px solid #CFD7DB;
  padding: 16px;
  border-radius: 10px;
  outline: none;
  width: 100%;
  height: 50px;
  color: #0c0c0d;
}

.input input::-webkit-inner-spin-button,
.input input::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

.input input:focus + .input__label {
  top: 5px;
  z-index: 10;
  font-size: 0.75rem;
  font-weight: 500;
}

.input input:focus {
  padding-top: 25px;
  background-color: #fff;
  border: 1px solid #689675;
}

.input input:not(:placeholder-shown) {
  padding-top: 25px;
  background-color: white;
}

.input input:not(:placeholder-shown) + .input__label {
  top: 5px;
  z-index: 10;
  font-size: 0.75rem;
  font-weight: 500;
}

.input--error {
  border: 1px solid #e51414 !important;
}

.label--error {
  color: #e51414;
}
</style>