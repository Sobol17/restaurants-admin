<script setup>
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import IconSearch from "@/components/icons/IconSearch.vue";
import {storeToRefs} from "pinia";
import {useNavigationStore} from "@/stores/client/navigation";
import {useRoute, useRouter} from "vue-router";
import OrdersNavigation from "@/components/client-orders/OrdersNavigation.vue";
import {computed} from "vue";

defineProps({
  link: String,
  white: Boolean,
})

const navStore = useNavigationStore()
const {title, showBackLink} = storeToRefs(navStore)

const router = useRouter()
const route = useRoute()

const handleClick = () => {
  router.back()
}

const handleSearchClick = () => {
  router.push({name: 'client-menu-search'})
}

const isOrdersNavigationVisible = computed(() => {
  return route.name === 'client-orders'
})

const isSearchVisible = computed(() => {
  return route.name === 'client-menu'
})
</script>

<template>
  <div class="header-wrap" :class="{ 'header-wrap--white': white }">
    <div class="header-wrap__inner">
      <button v-if="showBackLink" class="header-wrap__back" type="button" @click="handleClick">
        <IconArrowLeft/>
      </button>
      <p class="header-wrap__title">{{ title }}</p>
    <button
        v-if="isSearchVisible"
        class="header-wrap__action"
        type="button"
        aria-label="Поиск"
        @click="handleSearchClick"
    >
      <IconSearch/>
    </button>
    </div>

    <OrdersNavigation v-if="isOrdersNavigationVisible"/>
  </div>
</template>

<style scoped lang="scss">
.header-wrap {
  position: sticky;
  z-index: 10;
  top: 0;
  padding: 1rem 20px;
  background: #fff;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 0px 0px 6px 6px;

  &--white {
    background: var(--white-bg, #ffffff);
    border: none;
  }

  &__inner {
    position: relative;
    text-align: center;
  }

  &__back {
    border: none;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
  }

  &__action {
    border: none;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
  }

  &__title {
    font-size: var(--text-headline, 20px);
    line-height: 1.3;
    font-family: "SF Pro Display", serif;
    font-weight: 800;
  }
}
</style>
