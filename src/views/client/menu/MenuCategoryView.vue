<script setup>
import {computed, onMounted, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useRoute, useRouter} from 'vue-router'
import {useNavigationStore} from '@/stores/client/navigation'
import {useMenuStore} from '@/stores/client/menu'
import MenuDishCard from '@/components/client-menu/MenuDishCard.vue'

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore
changeTitle('Категория')
changeBackLinkVisible(true)

const route = useRoute()
const router = useRouter()
const categoryId = computed(() => route.params.categoryId)

const menuStore = useMenuStore()
const {
  categories,
  items,
  isLoading,
  isCategoryDeleting,
  isCategorySaving,
  categorySaveError,
  categoryDeleteError,
} = storeToRefs(menuStore)
const {
  toggleItemStatus,
  deleteDish,
  updateCategoryName,
  deleteCategory,
  loadCategories,
  loadDishesByCategory,
} = menuStore

const category = computed(() => {
  return categories.value.find((entry) => entry.id === categoryId.value)
})

const categoryName = computed({
  get: () => category.value?.name ?? '',
  set: (value) => {
    if (category.value) {
      updateCategoryName(category.value.id, value)
    }
  },
})

const formatDishesCount = (count) => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 14) {
    return `${count} блюд`
  }
  if (mod10 === 1) {
    return `${count} блюдо`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} блюда`
  }
  return `${count} блюд`
}

const filteredItems = computed(() => {
  return items.value.filter((item) => item.categoryId === categoryId.value)
})

const categoryItemsCount = computed(() => filteredItems.value.length)

const dishesLabel = computed(() => formatDishesCount(categoryItemsCount.value))

const handleDeleteCategory = () => {
  if (category.value) {
    deleteCategory(category.value.id)
      .then((removed) => {
        if (removed) {
          router.back()
        }
      })
  }
}

const handleAddDish = () => {
  router.push({name: 'client-menu-item-new', query: {categoryId: categoryId.value}})
}

const handleEditDish = (id) => {
  router.push({name: 'client-menu-item', params: {itemId: id}})
}

const handleDeleteDish = (id) => {
  deleteDish(id)
}

const errorMessage = computed(() => categorySaveError.value || categoryDeleteError.value)

watch(
  () => categoryId.value,
  (value) => {
    if (value) {
      loadDishesByCategory(value)
    }
  },
  {immediate: true},
)

onMounted(() => {
  loadCategories({skipLoading: true})
})
</script>

<template>
  <main class="menu-category-detail">
    <p v-if="errorMessage" class="menu-category-detail__error" role="alert">{{ errorMessage }}</p>
    <div class="menu-category-detail__field">
      <div class="menu-category-detail__label">Название</div>
      <input
          v-model.trim="categoryName"
          :disabled="isCategorySaving"
          type="text"
          class="menu-category-detail__input"
          placeholder="Название"
      />
    </div>

    <div class="menu-category-detail__count">{{ dishesLabel }}</div>

    <section class="menu-category-detail__list">
      <div v-if="isLoading" class="menu-category-detail__loader" role="status" aria-live="polite">
        <span class="menu-category-detail__spinner" aria-label="Загрузка"></span>
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
            show-delete
            @toggle="toggleItemStatus"
            @delete="handleDeleteDish"
            @edit="handleEditDish"
        />
      </template>
    </section>

    <div class="menu-category-detail__actions">
      <button
          type="button"
          class="menu-category-detail__btn menu-category-detail__btn--muted"
          :disabled="isCategoryDeleting"
          @click="handleDeleteCategory"
      >
        Удалить категорию
      </button>
      <button
          type="button"
          class="menu-category-detail__btn menu-category-detail__btn--accent"
          @click="handleAddDish"
      >
        Добавить блюдо
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-category-detail {
  min-height: 100vh;
  padding: 16px 16px 180px;
  background-color: #fff;
  margin-top: 10px;
  border-radius: 12px 12px 0 0;
}

.menu-category-detail__error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.menu-category-detail__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-category-detail__label {
  font-size: 12px;
  font-weight: 600;
  color: #b6b8b5;
}

.menu-category-detail__input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #e6e6e6;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
  outline: none;
}

.menu-category-detail__count {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #2c2c2c;
}

.menu-category-detail__list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-category-detail__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.menu-category-detail__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: menu-category-spin 0.8s linear infinite;
}

@keyframes menu-category-spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-category-detail__actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px 18px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0px -10px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 12px;
}

.menu-category-detail__btn {
  flex: 1;
  border: none;
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.menu-category-detail__btn--muted {
  background-color: #e8ebe6;
  color: #2c2c2c;
}

.menu-category-detail__btn--accent {
  background-color: $color-accent;
  color: #ffffff;
}

.menu-category-detail__btn--accent:active {
  background-color: #f27f22;
}
</style>
