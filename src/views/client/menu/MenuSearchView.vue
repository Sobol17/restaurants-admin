<script setup>
import {computed, onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {useMenuStore} from '@/stores/client/menu'
import MenuDishCard from '@/components/client-menu/MenuDishCard.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconClose from "@/components/icons/IconClose.vue";

const router = useRouter()
const menuStore = useMenuStore()
const {items, hints, isHintsLoading} = storeToRefs(menuStore)
const {toggleItemStatus, loadHints} = menuStore

const searchQuery = ref('')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return items.value
  }
  return items.value.filter(item => item.title.toLowerCase().includes(query))
})

const handleBack = () => {
  router.back()
}

const applySuggestion = (value) => {
  searchQuery.value = value
}

const clearSearch = () => {
  searchQuery.value = ''
}

const openDishEdit = (id) => {
  router.push({name: 'client-menu-item', params: {itemId: id}})
}

onMounted(loadHints)
</script>

<template>
  <main class="menu-search">
    <div class="menu-search__bar">
      <button class="menu-search__back" type="button" @click="handleBack" aria-label="Назад">
        <IconArrowLeft/>
      </button>
      <label class="menu-search__field">
        <IconSearch class="menu-search__icon"/>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск"
            class="menu-search__input"
        />
        <button
            v-if="searchQuery"
            type="button"
            class="menu-search__clear"
            @click="clearSearch"
            aria-label="Очистить поиск"
        >
          <IconClose/>
        </button>
      </label>
    </div>

    <div class="menu-search__chips">
      <div v-if="isHintsLoading" class="menu-search__loader" role="status" aria-live="polite">
        <span class="menu-search__spinner" aria-label="Загрузка"></span>
      </div>
      <template v-else>
        <button
            v-for="chip in hints"
            :key="chip"
            type="button"
            class="menu-search__chip"
            @click="applySuggestion(chip)"
        >
          {{ chip }}
        </button>
      </template>
    </div>

    <section class="menu-search__list">
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
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-search {
  min-height: 100vh;
  padding: 14px 16px 32px;
  background-color: #fff;
}

.menu-search__bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-search__back {
  border: 1px solid #e6e6e6;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #2c2c2c;
  cursor: pointer;
}

.menu-search__field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #f1f1f1;
  border: 1px solid #e6e6e6;
}

.menu-search__icon {
  width: 18px;
  height: 18px;
  color: $color-accent;
  flex-shrink: 0;
}

.menu-search__input {
  border: none;
  background: transparent;
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
  outline: none;
}

.menu-search__input::placeholder {
  color: #9a9a9a;
  font-weight: 500;
}

.menu-search__clear {
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  color: #7a7a7a;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.menu-search__chips {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.menu-search__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  width: 100%;
}

.menu-search__spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: menu-search-spin 0.8s linear infinite;
}

@keyframes menu-search-spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-search__chip {
  border: none;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: #ededed;
  color: #5f5f5f;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.menu-search__list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
