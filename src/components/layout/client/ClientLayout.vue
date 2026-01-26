<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useLayout} from '../admin/composables/layout'
import BottomNavigation from './BottomNavigation.vue'
import ClientHeader from './ClientHeader.vue'
import {getUser} from '@/api/user'

const {layoutConfig, layoutState, isSidebarActive} = useLayout()
const route = useRoute()

const outsideClickListener = ref(null)

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener()
  } else {
    unbindOutsideClickListener()
  }
})

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive':
        layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive,
  }
})

const isHeaderVisible = computed(() => {
  const match = [...route.matched].reverse().find((record) => record.meta?.bottomNav)
  return match ? !match.meta.hideHeader : true
})

const storeRestaurantId = (user) => {
  if (user?.restaurant_id !== null && user?.restaurant_id !== undefined) {
    localStorage.setItem('restaurant_id', String(user.restaurant_id))
  }
}

onMounted(async () => {
  try {
    const user = await getUser()
    storeRestaurantId(user)
  } catch (error) {
    console.error('Failed to load user data.', error)
  }
})

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive = false
        layoutState.staticMenuMobileActive = false
        layoutState.menuHoverActive = false
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event) {
  const sidebarEl = document.querySelector('.layout-sidebar')
  const topbarEl = document.querySelector('.layout-menu-button')

  return !(
      sidebarEl.isSameNode(event.target) ||
      sidebarEl.contains(event.target) ||
      topbarEl.isSameNode(event.target) ||
      topbarEl.contains(event.target)
  )
}
</script>

<template>
  <div class="client-wrapper" :class="containerClass">
    <ClientHeader v-if="isHeaderVisible"/>
    <div class="client-main">
      <router-view></router-view>
    </div>
    <BottomNavigation/>
    <div class="layout-mask animate-fadein"></div>
  </div>
</template>

<style>
.client-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #2C3029;
}

.client-main {
  flex-grow: 1;
}

.client-main p {
  margin: 0;
}
</style>
