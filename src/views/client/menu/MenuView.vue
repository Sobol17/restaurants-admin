<script setup>
import {computed, onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useNavigationStore} from '@/stores/client/navigation'
import {useMenuStore} from '@/stores/client/menu'
import MenuCategoryChip from '@/components/client-menu/MenuCategoryChip.vue'
import MenuIconChip from '@/components/client-menu/MenuIconChip.vue'
import MenuStatusTabs from '@/components/client-menu/MenuStatusTabs.vue'
import MenuDishCard from '@/components/client-menu/MenuDishCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import IconCutlery from '@/components/icons/IconCutlery.vue'
import IconSettingsDoc from "@/components/icons/IconSettingsDoc.vue";
import {useRouter} from "vue-router";

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore

changeTitle('Моё меню')
changeBackLinkVisible(true)

const menuStore = useMenuStore()
const {
  categories,
  activeCategoryId,
  statusTabs,
  activeStatusId,
  activeCategoryLabel,
  filteredItems,
  items,
  isLoading,
} = storeToRefs(menuStore)
const {setActiveCategory, setActiveStatus, toggleItemStatus, loadMenu} = menuStore

const router = useRouter()
const handleClickCategories = () => {
  router.push('/client/menu/categories')
}

const openDishEdit = (id) => {
  router.push({name: 'client-menu-item', params: {itemId: id}})
}

const handleAddDish = () => {
  router.push({name: 'client-menu-item-new'})
}

const currentCategoryItems = computed(() => {
  return items.value.filter(item => item.categoryId === activeCategoryId.value)
})

const emptyStateTitle = computed(() => {
  if (!categories.value.length) {
    return 'Категории пока не добавлены'
  }

  if (!currentCategoryItems.value.length) {
    return 'В этой категории пока нет блюд'
  }

  return activeStatusId.value === 'inactive'
    ? 'Нет неактивных блюд'
    : 'Нет активных блюд'
})

const emptyStateText = computed(() => {
  if (!categories.value.length) {
    return 'Добавьте категорию и затем создайте первое блюдо.'
  }

  if (!currentCategoryItems.value.length) {
    return 'Добавьте блюдо в выбранную категорию, и оно появится в списке.'
  }

  return 'Смените статусный фильтр или обновите статус блюда.'
})

onMounted(loadMenu)
</script>

<template>
  <main class="menu-view">
    <div class="menu-view__chips">
      <MenuIconChip @click="handleClickCategories">
        <IconSettingsDoc/>
      </MenuIconChip>
      <MenuCategoryChip
          v-for="category in categories"
          :key="category.id"
          :label="category.label"
          :active="category.id === activeCategoryId"
          @select="setActiveCategory(category.id)"
      />
    </div>

    <div class="menu-view__title">{{ activeCategoryLabel }}</div>

    <section class="menu-panel">
      <MenuStatusTabs
          :tabs="statusTabs"
          :active-id="activeStatusId"
          @change="setActiveStatus"
      />
      <div class="menu-panel__list">
        <div v-if="isLoading" class="menu-loader" role="status" aria-live="polite">
          <span class="menu-loader__spinner" aria-label="Загрузка"></span>
        </div>
        <div v-else-if="filteredItems.length === 0" class="menu-empty" role="status" aria-live="polite">
          <div class="menu-empty__title">{{ emptyStateTitle }}</div>
          <p class="menu-empty__text">{{ emptyStateText }}</p>
        </div>
        <template v-else>
          <MenuDishCard
              v-for="item in filteredItems"
              :key="item.id"
              :id="item.id"
              :title="item.title"
              :price="item.price"
              :image="item.image"
              :active="item.isActive"
              @toggle="toggleItemStatus"
              @edit="openDishEdit"
          />
        </template>
      </div>
    </section>

    <div class="menu-actions">
      <AppButton text="Добавить блюдо" accent block elevated @click="handleAddDish">
        <IconCutlery class="menu-actions__icon"/>
      </AppButton>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/layout/colors" as *;

.menu-view {
  min-height: 100vh;
  padding: 10px 16px 190px;
  background-color: #fff;
  margin-top: 10px;
  border-radius: 12px 12px 0 0;
}

.menu-view__chips {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 0 2px;
  scrollbar-width: none;
}

.menu-view__chips::-webkit-scrollbar {
  display: none;
}

.menu-view__title {
  margin-top: 14px;
  font-size: 17px;
  font-weight: 700;
  color: #2c2c2c;
}

.menu-panel {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-panel__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-empty {
  min-height: 32vh;
  border: 1px dashed #e4dccf;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffaf4 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  text-align: center;
}

.menu-empty__title {
  font-size: 16px;
  font-weight: 700;
  color: #2c2c2c;
}

.menu-empty__text {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #6b6b6b;
  max-width: 260px;
}

.menu-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.menu-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: menu-spin 0.8s linear infinite;
}

@keyframes menu-spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-actions {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2;
  bottom: 64px;
  padding: 12px 16px 20px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0px -10px 24px rgba(0, 0, 0, 0.08);
}

.menu-actions__icon {
  width: 18px;
  height: 18px;
  color: #fff;
}

@media (min-width: 768px) {
  .menu-actions {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(480px, 100%);
    border-radius: 12px 12px 0 0;
  }
}
</style>
