import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

const getCategoryLabel = (count) => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 14) {
    return 'категорий'
  }
  if (mod10 === 1) {
    return 'категория'
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'категории'
  }
  return 'категорий'
}

export const useMenuCategoriesStore = defineStore('menuCategories', () => {
  const categories = ref([
    {id: 'popular', name: 'Популярное', itemsCount: 24},
    {id: 'seasonal', name: 'Сезонное сет', itemsCount: 24},
    {id: 'new', name: 'Новинки', itemsCount: 24},
    {id: 'burgers', name: 'Бургеры', itemsCount: 24},
  ])

  const totalCount = ref(23)

  const totalLabel = computed(() => `${totalCount.value} ${getCategoryLabel(totalCount.value)}`)

  const getCategoryById = (id) => {
    return categories.value.find((entry) => entry.id === id)
  }

  const updateCategoryName = (id, name) => {
    const category = getCategoryById(id)
    if (category) {
      category.name = name
    }
  }

  const removeCategory = (id) => {
    const prevLength = categories.value.length
    categories.value = categories.value.filter((entry) => entry.id !== id)
    if (categories.value.length !== prevLength && totalCount.value > 0) {
      totalCount.value -= 1
    }
  }

  const addCategory = () => {
    const nextIndex = categories.value.length + 1
    categories.value.unshift({
      id: `category-${Date.now()}`,
      name: `Категория ${nextIndex}`,
      itemsCount: 0,
    })
    totalCount.value += 1
  }

  return {
    categories,
    totalCount,
    totalLabel,
    addCategory,
    getCategoryById,
    updateCategoryName,
    removeCategory,
  }
})
