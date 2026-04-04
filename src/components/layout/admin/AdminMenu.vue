<script setup>
import {computed, ref} from 'vue'
import {useAuthStore} from '@/stores/auth'
import AdminMenuItem from "@/components/layout/admin/AdminMenuItem.vue";

const authStore = useAuthStore()
const userRole = authStore.getUserRole()

const allItems = ref([
  {
    label: 'Основные функции',
    items: [
      {
        label: 'Главная',
        icon: 'pi pi-fw pi-home',
        to: '/admin/dashboard',
      },
      {
        label: 'Рекламные баннеры',
        icon: 'pi pi-fw pi-table',
        to: '/admin/ads',
        roles: ['admin'],
      },
      {
        label: 'Рестораны',
        icon: 'pi pi-fw pi-map-marker',
        to: '/admin/restaurants',
        roles: ['admin'],
      },
      {
        label: 'Заказы',
        icon: 'pi pi-fw pi-box',
        to: '/admin/orders',
      },
      {
        label: 'Пользователи',
        icon: 'pi pi-fw pi-user',
        to: '/admin/users',
        roles: ['admin'],
      },
      {
        label: 'Курьеры',
        icon: 'pi pi-fw pi-truck',
        to: '/admin/couriers',
        roles: ['admin'],
      },
    ],
  },
])

const model = computed(() => {
  return allItems.value.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!item.roles) return true
      return item.roles.includes(userRole)
    }),
  }))
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AdminMenuItem v-if="!item.separator" :item="item" :index="i"></AdminMenuItem>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
