<script setup>
import {computed, useSlots} from 'vue'

const emits = defineEmits(['click']);
const props = defineProps({
  text: {
    type: String,
    required: true,
    default: 'Кнопка',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: Boolean,
  sm: Boolean,
  icon: Boolean,
  big: Boolean,
  gold: Boolean,
  transparent: Boolean,
  no_border: Boolean,
  price: Number,
  secondary: Boolean,
  accent: Boolean,
  block: Boolean,
  elevated: Boolean,
  md: Boolean,
});

const classObject = computed(() => {
  return {
    sm: props.sm,
    md: props.md,
    big: props.big,
    transparent: props.transparent,
    gold: props.gold,
    icon: props.icon,
    no_border: props.no_border,
    secondary: props.secondary,
    accent: props.accent,
    block: props.block,
    elevated: props.elevated,
  };
});

const slots = useSlots()
const hasSlots = computed(() => !!slots.default)
</script>

<template>
  <button :type="type" :disabled="disabled" class="button" :class="classObject" @click="emits('click')">
    <div class="button__slot" v-if="hasSlots">
      <slot></slot>
    </div>
    <span class="button__content" :class="{'button__content--with-price': price > 0}">
      <span>{{ text }}</span>
      <span
          v-if="price > 0"
          class="button__price"
      >
        {{ price }}
      </span>
    </span>
  </button>
</template>

<style scoped lang="scss">
.button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 20px;
  height: 48px;
  border-radius: 12px;
  background: #E8EBE6;
  color: #2C3029;
  font-size: var(--button-text-size, 14px);
  font-weight: var(--button-font-weight, 600);
  line-height: 1;
  white-space: nowrap;
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
}

.button:hover {
  background: #cbd1cb;
}

.button:active {
  background: #cbd1cb;
}

.button:disabled {
  cursor: not-allowed;
  background-color: var(--neutral-500, #737373);

  &:hover {
    background-color: var(--neutral-500, #737373);
  }
}

.block {
  width: 100%;
}

.button__slot {
  display: flex;
  align-items: center;
  height: 24px;
  max-width: 24px;
}

.button__content {
  display: inline-block;
}

.button__content--with-price {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.button__price {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  opacity: 0.7;
}

.transparent {
  background-color: #EEF0F0;
  color: #494949;
}

.transparent:hover {
  background-color: #ededed;
}

.transparent:active {
  background-color: #e3e3e3;
}

.transparent:disabled {
  color: #adadad;
}

.gold {
  background-color: #BBAB70 !important;
}

.gold:disabled {
  background-color: #adadad !important;
  color: white !important;
}

.md {
  height: 45px;
  font-size: 13px;
  border-radius: 10px;
}

.sm {
  height: 35px;
  font-size: 13px;
  border-radius: 8px;
}

.icon {
  width: 40px;
  height: 40px;
  padding-left: 0;
  padding-right: 0;
  border-radius: 8px;
}

.no_border {
  border: none !important;
}

.secondary {
  color: var(--green, #2f9e5f);
  background: #fff;
  border: 1px solid var(--green, #2f9e5f);
}

.secondary:hover,
.secondary:active {
  background: var(--neutral-200, #e5e5e5);
}

.accent {
  background-color: var(--accent, #ff8a2a);
  border-radius: 12px;
  height: 48px;
  font-size: 15px;
  color: #fff;
}

.accent:hover,
.accent:active {
  background-color: var(--accent-dark, #f27f22);
}

.elevated {
  box-shadow: 0 8px 16px rgba(255, 138, 42, 0.2);
}
</style>
