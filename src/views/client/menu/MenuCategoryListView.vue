<script setup>
import {computed, onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {useMenuStore} from '@/stores/client/menu'
import IconAngleRight from '@/components/icons/IconAngleRight.vue'
import {useNavigationStore} from "@/stores/client/navigation";
import ModalBottom from '@/components/ModalBottom.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const navStore = useNavigationStore()
const router = useRouter()

const {changeTitle, changeBackLinkVisible} = navStore
changeTitle("Ваши категории")
changeBackLinkVisible(true)

const menuStore = useMenuStore()
const {categories, totalLabel, isLoading, isCategorySaving} = storeToRefs(menuStore)
const {addCategory, loadCategories} = menuStore

const addCategoryModal = ref(null)
const newCategoryName = ref('')
const isNameValid = computed(() => newCategoryName.value.trim().length > 0)

const openCategory = (id) => {
  router.push({name: 'client-menu-category', params: {categoryId: id}})
}

const openAddCategory = () => {
  newCategoryName.value = ''
  addCategoryModal.value?.openModal()
}

const submitAddCategory = async () => {
  if (!isNameValid.value || isCategorySaving.value) {
    return
  }

  await addCategory(newCategoryName.value.trim())
  addCategoryModal.value?.closeModal()
  newCategoryName.value = ''
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <main class="menu-categories">

    <div class="menu-categories__count">{{ totalLabel }}</div>

    <button class="menu-categories__add" type="button" :disabled="isCategorySaving" @click="openAddCategory">
      <span class="menu-categories__add-icon">+</span>
      <span class="menu-categories__add-text">Добавить категорию</span>
    </button>

    <section class="menu-categories__list">
      <div v-if="isLoading" class="menu-categories__loader" role="status" aria-live="polite">
        <span class="menu-categories__spinner" aria-label="Загрузка"></span>
      </div>
      <template v-else>
        <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="menu-category"
            @click="openCategory(category.id)"
        >
          <span class="menu-category__handle"></span>
          <div class="menu-category__content">
            <div class="menu-category__name">{{ category.name }}</div>
            <div class="menu-category__meta">{{ category.itemsCount }} блюд</div>
          </div>
          <IconAngleRight class="menu-category__arrow"/>
        </button>
      </template>
    </section>
    <ModalBottom ref="addCategoryModal">
      <div class="menu-category-modal" @keyup.enter="submitAddCategory">
        <div class="menu-category-modal__title">Новая категория</div>
        <AppInput
          v-model="newCategoryName"
          name="new-category"
          label="Название категории"
          :disabled="isCategorySaving"
        />
        <div class="menu-category-modal__actions">
          <AppButton
            text="Создать"
            accent
            block
            :disabled="!isNameValid || isCategorySaving"
            @click="submitAddCategory"
          />
        </div>
      </div>
    </ModalBottom>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-categories {
  min-height: 100vh;
  padding: 12px 16px 32px;
  background-color: #fff;
  margin-top: 10px;
  border-radius: 12px 12px 0 0;
}

.menu-categories__count {
  font-size: 20px;
  font-weight: 700;
  color: #2c2c2c;
}

.menu-categories__add {
  margin-top: 12px;
  width: 100%;
  border: 1px solid #ededed;
  border-radius: 14px;
  background-color: $color-bg-muted;
  padding: 12px 16px;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  cursor: pointer;
}

.menu-categories__add-icon {
  width: 18px;
  height: 18px;
  color: $color-accent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.menu-categories__add-text {
  color: $color-accent;
  font-weight: 600;
  font-size: 14px;
}

.menu-categories__list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-categories__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.menu-categories__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: menu-categories-spin 0.8s linear infinite;
}

@keyframes menu-categories-spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-category {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background-color: $color-bg-muted;
  border: 1px solid #ededed;
  text-align: left;
  cursor: pointer;
}

.menu-category__handle {
  width: 16px;
  height: 12px;
  background: linear-gradient(#b6b8b5, #b6b8b5) 0 0 / 100% 2px,
  linear-gradient(#b6b8b5, #b6b8b5) 0 5px / 100% 2px,
  linear-gradient(#b6b8b5, #b6b8b5) 0 10px / 100% 2px;
  background-repeat: no-repeat;
  border-radius: 2px;
  flex-shrink: 0;
}

.menu-category__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.menu-category__name {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.menu-category__meta {
  font-size: 12px;
  color: #b6b8b5;
  font-weight: 600;
}

.menu-category__arrow {
  color: #b6b8b5;
  flex-shrink: 0;
}

.menu-category-modal {
  padding: 6px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-category-modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
}

.menu-category-modal__actions {
  margin-top: 6px;
}
</style>
