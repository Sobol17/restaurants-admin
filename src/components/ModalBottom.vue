<script setup>
import {ref} from 'vue'

defineProps({
  fullScreen: Boolean
})

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

defineExpose({openModal, closeModal});
</script>

<template>
  <Transition name="fade">
    <div
        v-if="isOpen"
        class="modal-overlay"
        @click="closeModal"
    ></div>
  </Transition>

  <Transition name="slide-up">
    <div
        v-if="isOpen"
        class="modal-content"
        :class="{'modal-content--fullscreen': fullScreen}"
    >
      <div
          @click="closeModal"
          class="modal-handle"
      >
        <span class="modal-handle__bar"></span>
      </div>

      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal-content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-width: 800px;

  &--fullscreen {
    top: 0;
    border-radius: 0;
  }
}

@media (min-width: 640px) {
  .modal-content--fullscreen {
    top: 60px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
}

.modal-handle {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 10px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.modal-handle__bar {
  display: block;
  width: 28px;
  height: 5px;
  background: var(--green-light-2, #b6e3c6);
  border-radius: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
