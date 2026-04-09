import axiosInst from '@/api/axios.instance'
import { debounce } from '@/utils/debounce'
import { waitForRestaurantId } from '@/utils/restaurantId'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const API_URL = '/restaurants'

const buildStatusTabs = () => [
  { id: 'active', label: 'Активные', value: true },
  { id: 'inactive', label: 'Неактивные', value: false },
]

const getCategoryLabel = count => {
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

const normalizeId = id => (id === null || id === undefined ? '' : String(id))

const formatPrice = value => {
  const parsed = Number(value)
  const numeric = Number.isFinite(parsed) ? parsed : 0
  return `${numeric.toLocaleString('ru-RU')} ₽`
}

const parsePrice = value => {
  if (value === null || value === undefined || value === '') {
    return 0
  }
  const normalized = String(value)
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeNumber = value => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const mapCategory = (category, index) => ({
  id: normalizeId(category?.id ?? `category-${index}`),
  label: category?.name ?? 'Категория',
  name: category?.name ?? 'Категория',
  dishesCount: category?.dishes_count ?? 0,
  itemsCount: category?.dishes_count ?? 0,
})

const mapDish = (dish, index, fallbackCategoryId) => {
  const images = Array.isArray(dish?.images_urls)
    ? dish.images_urls.filter(Boolean)
    : []
  const image =
    `https://admin.daimfood.ru${images[0]}` ??
    'https://placehold.co/96x96?text=Food'
  const categoryId = normalizeId(dish?.category?.id ?? fallbackCategoryId)

  return {
    id: normalizeId(dish?.id ?? `dish-${categoryId}-${index}`),
    title: dish?.name ?? 'Без названия',
    price: formatPrice(dish?.price),
    image,
    images,
    description: dish?.description ?? '',
    categoryId,
    isActive: !dish?.is_paused,
  }
}

const mapDishDetails = dish => ({
  id: normalizeId(dish?.id),
  title: dish?.name ?? '',
  price:
    dish?.price !== null && dish?.price !== undefined ? String(dish.price) : '',
  description: dish?.description ?? '',
  categoryId: normalizeId(dish?.category?.id ?? dish?.category_id),
  isActive: !dish?.is_paused,
  images: Array.isArray(dish?.images_urls)
    ? dish.images_urls.filter(Boolean)
    : [],
})

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([])
  const items = ref([])
  const activeCategoryId = ref('')
  const statusTabs = ref(buildStatusTabs())
  const activeStatusId = ref(statusTabs.value[0].id)
  const isLoading = ref(false)
  const hints = ref([])
  const isHintsLoading = ref(false)
  const dish = ref(null)
  const isDishLoading = ref(false)
  const isDishSaving = ref(false)
  const isDishDeleting = ref(false)
  const dishLoadError = ref('')
  const dishSaveError = ref('')
  const dishDeleteError = ref('')
  const isCategorySaving = ref(false)
  const isCategoryDeleting = ref(false)
  const categorySaveError = ref('')
  const categoryDeleteError = ref('')
  const restaurantId = ref(null)

  const activeCategoryLabel = computed(() => {
    return (
      categories.value.find(item => item.id === activeCategoryId.value)
        ?.label ?? ''
    )
  })

  const activeStatusValue = computed(() => {
    return (
      statusTabs.value.find(tab => tab.id === activeStatusId.value)?.value ??
      true
    )
  })

  const totalCount = computed(() => categories.value.length)

  const totalLabel = computed(
    () => `${totalCount.value} ${getCategoryLabel(totalCount.value)}`,
  )

  const filteredItems = computed(() => {
    return items.value.filter(item => {
      const matchesCategory = item.categoryId === activeCategoryId.value
      const matchesStatus = item.isActive === activeStatusValue.value
      return matchesCategory && matchesStatus
    })
  })

  const ensureRestaurantId = async () => {
    if (restaurantId.value) {
      return restaurantId.value
    }

    const id = await waitForRestaurantId()
    restaurantId.value = id
    return id
  }

  const getCategories = id => {
    return axiosInst
      .get(`${API_URL}/categories`, { params: { restaurant_id: id } })
      .then(res => res.data)
  }

  const getDishesByCategory = (id, categoryId) => {
    return axiosInst
      .get(`${API_URL}/categories/dishes`, {
        params: { restaurant_id: id, category_id: categoryId },
      })
      .then(res => res.data)
  }

  const addCategory = name => {
    return axiosInst
      .post(`${API_URL}/menu/category/add`, null, { params: { name } })
      .then(res => res.data)
  }

  const updateCategory = payload => {
    return axiosInst
      .post(`${API_URL}/menu/category/update`, payload)
      .then(res => res.data)
  }

  const updateCategoryImage = (categoryId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    return axiosInst
      .post(`${API_URL}/menu/category/update/image`, formData, {
        params: { category_id: categoryId },
      })
      .then(res => res.data)
  }

  const removeCategory = categoryId => {
    return axiosInst
      .post(`${API_URL}/menu/category/remove`, null, {
        params: { category_id: categoryId },
      })
      .then(res => res.data)
  }

  const getHints = id => {
    return axiosInst
      .get(`${API_URL}/hints`, { params: { restaurant_id: id } })
      .then(res => res.data)
  }

  const getDish = dishId => {
    return axiosInst
      .get(`${API_URL}/dish`, { params: { dish_id: dishId } })
      .then(res => res.data)
  }

  const addDish = (payload, files = []) => {
    const formData = new FormData()
    formData.append('name', payload.name)
    formData.append('price', payload.price)
    formData.append('description', payload.description)
    formData.append('category_id', payload.category_id)
    formData.append('is_paused', payload.is_paused)
    files.forEach(file => formData.append('images', file))
    return axiosInst.post(`${API_URL}/menu/add`, formData).then(res => res.data)
  }

  const updateDish = payload => {
    return axiosInst
      .post(`${API_URL}/menu/update`, payload)
      .then(res => res.data)
  }

  const removeDish = dishId => {
    return axiosInst
      .post(`${API_URL}/menu/remove`, null, { params: { dish_id: dishId } })
      .then(res => res.data)
  }

  const addDishImages = (dishId, files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    return axiosInst
      .post(`${API_URL}/menu/images/add`, formData, {
        params: { dish_id: dishId },
      })
      .then(res => res.data)
  }

  const setHints = data => {
    hints.value = Array.isArray(data) ? data.filter(Boolean) : []
  }

  const getCategoryById = id => {
    const normalized = normalizeId(id)
    return categories.value.find(entry => entry.id === normalized)
  }

  const applyCategories = data => {
    const mappedCategories = Array.isArray(data) ? data.map(mapCategory) : []
    categories.value = mappedCategories

    const currentId = normalizeId(activeCategoryId.value)
    const nextActiveId =
      mappedCategories.find(item => item.id === currentId)?.id ??
      mappedCategories[0]?.id ??
      ''
    activeCategoryId.value = nextActiveId
    return nextActiveId
  }

  const replaceCategoryItems = (categoryId, nextItems) => {
    const normalizedCategoryId = normalizeId(categoryId)
    const otherItems = items.value.filter(
      item => item.categoryId !== normalizedCategoryId,
    )
    items.value = [...otherItems, ...nextItems]
  }

  const upsertItemFromDish = (dishData, fallbackCategoryId) => {
    if (!dishData) {
      return
    }

    const mapped = mapDish(dishData, 0, fallbackCategoryId)
    const index = items.value.findIndex(
      entry => normalizeId(entry.id) === mapped.id,
    )
    if (index >= 0) {
      items.value.splice(index, 1, mapped)
      return
    }

    items.value.unshift(mapped)
  }

  const buildDishPayload = (form, { includeId = false } = {}) => {
    const payload = {
      name: form?.title?.trim() ?? '',
      price: parsePrice(form?.price),
      description: form?.description?.trim() ?? '',
      category_id: normalizeNumber(form?.categoryId),
      is_paused: !form?.isActive,
    }

    if (includeId) {
      payload.id = normalizeNumber(form?.id)
    }

    return payload
  }

  const loadDishesByCategory = async (
    categoryId,
    { skipLoading = false } = {},
  ) => {
    const normalizedCategoryId = normalizeId(categoryId)
    if (!skipLoading) {
      isLoading.value = true
    }

    try {
      const id = await ensureRestaurantId()
      if (!id || !normalizedCategoryId) {
        replaceCategoryItems(normalizedCategoryId, [])
        return
      }

      const data = await getDishesByCategory(id, normalizedCategoryId)
      const mapped = Array.isArray(data)
        ? data.map((dish, index) => mapDish(dish, index, normalizedCategoryId))
        : []
      replaceCategoryItems(normalizedCategoryId, mapped)
    } catch (error) {
      console.error('Failed to load menu dishes.', error)
      replaceCategoryItems(normalizedCategoryId, [])
    } finally {
      if (!skipLoading) {
        isLoading.value = false
      }
    }
  }

  const loadMenu = async () => {
    isLoading.value = true
    try {
      const id = await ensureRestaurantId()
      if (!id) {
        categories.value = []
        items.value = []
        activeCategoryId.value = ''
        return
      }

      const data = await getCategories(id)
      const nextActiveId = applyCategories(data)

      if (nextActiveId) {
        await loadDishesByCategory(nextActiveId, { skipLoading: true })
      } else {
        items.value = []
      }
    } catch (error) {
      console.error('Failed to load menu categories.', error)
      categories.value = []
      items.value = []
      activeCategoryId.value = ''
    } finally {
      isLoading.value = false
    }
  }

  const loadCategories = async ({ skipLoading = false } = {}) => {
    if (!skipLoading) {
      isLoading.value = true
    }

    try {
      const id = await ensureRestaurantId()
      if (!id) {
        categories.value = []
        activeCategoryId.value = ''
        return
      }

      const data = await getCategories(id)
      applyCategories(data)
    } catch (error) {
      console.error('Failed to load menu categories.', error)
      categories.value = []
      activeCategoryId.value = ''
    } finally {
      if (!skipLoading) {
        isLoading.value = false
      }
    }
  }

  const addCategoryItem = category => {
    const mapped = mapCategory(category, categories.value.length)
    categories.value = [mapped, ...categories.value]
    if (!activeCategoryId.value) {
      activeCategoryId.value = mapped.id
    }
  }

  const addCategoryAction = async name => {
    if (isCategorySaving.value) {
      return null
    }

    const title = name?.trim() || `Категория ${categories.value.length + 1}`
    categorySaveError.value = ''
    categoryDeleteError.value = ''
    isCategorySaving.value = true
    try {
      const data = await addCategory(title)
      if (data && typeof data === 'object' && data.id !== undefined) {
        addCategoryItem(data)
      } else {
        await loadCategories({ skipLoading: true })
      }
      return data
    } catch (error) {
      categorySaveError.value = 'Failed to add category.'
      console.error(categorySaveError.value, error)
      return null
    } finally {
      isCategorySaving.value = false
    }
  }

  const persistCategoryName = debounce(async payload => {
    if (!payload?.id) {
      return
    }

    isCategorySaving.value = true
    try {
      await updateCategory({
        id: normalizeNumber(payload.id),
        name: payload.name?.trim() ?? '',
      })
    } catch (error) {
      categorySaveError.value = 'Failed to update category.'
      console.error(categorySaveError.value, error)
    } finally {
      isCategorySaving.value = false
    }
  }, 400)

  const updateCategoryName = (id, name) => {
    const category = getCategoryById(id)
    if (category) {
      category.name = name
      category.label = name
    }
    categorySaveError.value = ''
    categoryDeleteError.value = ''
    persistCategoryName({ id, name })
  }

  const deleteCategory = async id => {
    if (isCategoryDeleting.value) {
      return false
    }

    categoryDeleteError.value = ''
    categorySaveError.value = ''
    isCategoryDeleting.value = true
    try {
      await removeCategory(id)
      const normalized = normalizeId(id)
      categories.value = categories.value.filter(
        entry => entry.id !== normalized,
      )
      items.value = items.value.filter(entry => entry.categoryId !== normalized)
      if (activeCategoryId.value === normalized) {
        activeCategoryId.value = categories.value[0]?.id ?? ''
      }
      return true
    } catch (error) {
      categoryDeleteError.value = 'Failed to remove category.'
      console.error(categoryDeleteError.value, error)
      return false
    } finally {
      isCategoryDeleting.value = false
    }
  }

  const uploadCategoryImage = async (categoryId, file) => {
    if (!file || isCategorySaving.value) {
      return false
    }

    categorySaveError.value = ''
    isCategorySaving.value = true
    try {
      await updateCategoryImage(categoryId, file)
      return true
    } catch (error) {
      categorySaveError.value = 'Failed to update category image.'
      console.error(categorySaveError.value, error)
      return false
    } finally {
      isCategorySaving.value = false
    }
  }

  const loadHints = async () => {
    isHintsLoading.value = true
    try {
      const id = await ensureRestaurantId()
      if (!id) {
        setHints([])
        return
      }

      const data = await getHints(id)
      setHints(data)
    } catch (error) {
      console.error('Failed to load menu hints.', error)
      setHints([])
    } finally {
      isHintsLoading.value = false
    }
  }

  const loadDishById = async dishId => {
    dishLoadError.value = ''
    dishSaveError.value = ''
    dishDeleteError.value = ''
    isDishLoading.value = true
    try {
      const data = await getDish(dishId)
      const mapped = mapDishDetails(data)
      dish.value = mapped
      return mapped
    } catch (error) {
      dishLoadError.value = 'Failed to load dish.'
      console.error(dishLoadError.value, error)
      dish.value = null
      return null
    } finally {
      isDishLoading.value = false
    }
  }

  const createDish = async (form, files = []) => {
    if (isDishSaving.value) {
      return null
    }

    dishSaveError.value = ''
    dishLoadError.value = ''
    dishDeleteError.value = ''
    isDishSaving.value = true
    try {
      const payload = buildDishPayload(form)
      const data = await addDish(payload, files)
      const responseId =
        typeof data === 'number' ? data : (data?.id ?? data?.dish_id)
      const dishId = normalizeId(responseId)

      const dishData = {
        ...payload,
        id: dishId || responseId,
        name: data?.name ?? payload.name,
        price: data?.price ?? payload.price,
        description: data?.description ?? payload.description,
        is_paused: data?.is_paused ?? payload.is_paused,
        category: data?.category ?? { id: payload.category_id },
        images_urls: Array.isArray(data?.images_urls) ? data.images_urls : [],
      }
      if (dishData.id) {
        upsertItemFromDish(dishData, payload.category_id)
      }

      return dishId || dishData.id || null
    } catch (error) {
      dishSaveError.value = 'Failed to add dish.'
      console.error(dishSaveError.value, error)
      return null
    } finally {
      isDishSaving.value = false
    }
  }

  const saveDish = async (form, files = []) => {
    if (isDishSaving.value) {
      return false
    }

    dishSaveError.value = ''
    dishLoadError.value = ''
    dishDeleteError.value = ''
    isDishSaving.value = true
    try {
      const payload = buildDishPayload(form, { includeId: true })
      await updateDish(payload)
      if (files.length) {
        await addDishImages(payload.id, files)
      }

      const existing = getItemById(payload.id)
      const existingImages =
        Array.isArray(existing?.images) && existing.images.length
          ? existing.images
          : existing?.image
            ? [existing.image]
            : []
      const dishData = {
        ...payload,
        name: payload.name,
        price: payload.price,
        description: payload.description,
        is_paused: payload.is_paused,
        category: { id: payload.category_id },
        images_urls: existingImages,
      }
      upsertItemFromDish(dishData, payload.category_id)
      return true
    } catch (error) {
      dishSaveError.value = 'Failed to update dish.'
      console.error(dishSaveError.value, error)
      return false
    } finally {
      isDishSaving.value = false
    }
  }

  const deleteDish = async dishId => {
    if (isDishDeleting.value) {
      return false
    }

    dishDeleteError.value = ''
    dishLoadError.value = ''
    dishSaveError.value = ''
    isDishDeleting.value = true
    try {
      await removeDish(dishId)
      removeItem(dishId)
      if (normalizeId(dish.value?.id) === normalizeId(dishId)) {
        dish.value = null
      }
      return true
    } catch (error) {
      dishDeleteError.value = 'Failed to remove dish.'
      console.error(dishDeleteError.value, error)
      return false
    } finally {
      isDishDeleting.value = false
    }
  }

  const setActiveCategory = async id => {
    const normalizedCategoryId = normalizeId(id)
    if (normalizedCategoryId === activeCategoryId.value) {
      return
    }
    activeCategoryId.value = normalizedCategoryId
    await loadDishesByCategory(normalizedCategoryId)
  }

  const setActiveStatus = id => {
    activeStatusId.value = id
  }

  const getItemById = id => {
    return items.value.find(entry => normalizeId(entry.id) === normalizeId(id))
  }

  const toggleItemStatus = async (id, value) => {
    const item = getItemById(id)
    if (!item) {
      return
    }

    const previous = item.isActive
    item.isActive = value

    try {
      await updateDish({
        id: normalizeNumber(item.id),
        name: item.title,
        price: parsePrice(item.price),
        description: item.description ?? '',
        category_id: normalizeNumber(item.categoryId),
        is_paused: !value,
      })
    } catch (error) {
      item.isActive = previous
      console.error('Failed to toggle dish status.', error)
    }
  }

  const removeItem = id => {
    const normalized = normalizeId(id)
    items.value = items.value.filter(
      entry => normalizeId(entry.id) !== normalized,
    )
  }

  const addItem = payload => {
    const id = Date.now()
    const categoryId = normalizeId(payload.categoryId ?? activeCategoryId.value)
    items.value.unshift({
      id,
      title: payload.title,
      price: payload.price,
      image: payload.image,
      images: payload.images ?? [],
      description: payload.description ?? '',
      categoryId,
      isActive: payload.isActive ?? true,
    })
    return id
  }

  const updateItem = (id, payload) => {
    const item = getItemById(id)
    if (item) {
      Object.assign(item, payload)
    }
  }

  const clearDish = () => {
    dish.value = null
  }

  const clearCache = () => {
    restaurantId.value = null
    categories.value = []
    items.value = []
    activeCategoryId.value = ''
  }

  return {
    categories,
    activeCategoryId,
    statusTabs,
    activeStatusId,
    items,
    isLoading,
    hints,
    isHintsLoading,
    dish,
    isDishLoading,
    isDishSaving,
    isDishDeleting,
    dishLoadError,
    dishSaveError,
    dishDeleteError,
    isCategorySaving,
    isCategoryDeleting,
    categorySaveError,
    categoryDeleteError,
    totalLabel,
    activeCategoryLabel,
    filteredItems,
    setActiveCategory,
    setActiveStatus,
    toggleItemStatus,
    removeItem,
    getItemById,
    addItem,
    updateItem,
    updateCategoryName,
    addCategory: addCategoryAction,
    deleteCategory,
    uploadCategoryImage,
    loadMenu,
    loadCategories,
    loadHints,
    loadDishById,
    createDish,
    saveDish,
    deleteDish,
    clearDish,
    clearCache,
    loadDishesByCategory,
  }
})
