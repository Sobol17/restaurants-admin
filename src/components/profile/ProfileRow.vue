<script setup>
import IconAngleRight from '@/components/icons/IconAngleRight.vue'
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  icon: {
    type: [Object, Function],
    required: true,
  },
  link: {
    type: String,
    default: '/client/profile',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  action: {
    type: Function,
    default: null,
  },
})
</script>

<template>
  <component
    :is="action ? 'button' : RouterLink"
    v-bind="action ? {} : { to: link }"
    class="profile-row"
    @click="action ? action() : undefined"
  >
    <component :is="icon" />
    <p class="profile-row__text" :class="{ 'profile-row__angle--in': invalid }">
      {{ title }}
    </p>
    <IconAngleRight
      class="profile-row__angle"
      :class="{ 'profile-row__angle--in': invalid }"
    />
  </component>
</template>

<style scoped lang="scss">
@use '@/assets/layout/colors' as *;

.profile-row {
  cursor: pointer;
  display: flex;
  column-gap: 12px;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  text-align: left;

  &__text {
    font-size: 16px;
    font-weight: 500;

    &--in {
      color: $color-danger;
    }
  }

  &__angle {
    margin-left: auto;
    color: $color-muted;

    &--in {
      color: $color-danger;
    }
  }
}
</style>
