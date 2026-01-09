<script setup>
import {ref} from 'vue'

import AdminMenuItem from "@/components/layout/admin/AdminMenuItem.vue";

const model = ref([
  {
    label: 'Основные функции',
    items: [
      {
        label: 'Рекламные баннеры',
        icon: 'pi pi-fw pi-table',
        to: '/admin/ads',
      },
      {
        label: 'Рестораны',
        icon: 'pi pi-fw pi-map-marker',
        to: '/admin/restaurants',
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
      },
      {
        label: 'Курьеры',
        icon: 'pi pi-fw pi-truck',
        to: '/admin/couriers',
      },
    ],
  },
])
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
