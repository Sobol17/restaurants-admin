import {defineStore} from 'pinia'
import {computed, reactive, ref} from 'vue'
import {useRestaurantsApi} from '@/services/useRestaurants'
import {useToast} from 'primevue/usetoast'
import {FilterMatchMode} from '@primevue/core/api'
import {debounce} from '@/utils/debounce'
import {usePhotoUtils} from '@/utils/usePhotoUtils'
import {getImagePath} from '@/utils/getImagePath'

export const useRestaurantsStore = defineStore('restaurants', () => {
  const {getList, create, update, updateImages, deleteElement} = useRestaurantsApi()
  const {data: restaurantsData, isLoading} = getList()

  const toast = useToast()

  const showDetailDialog = ref(false)
  const showDeleteDialog = ref(false)
  const isEdit = ref(false)
  const submitted = ref(false)
  const expandedRows = ref([])
  const deleteTargetId = ref(null)

  const filters = ref({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  })

  const restaurantsList = computed(() => {
    return restaurantsData?.value || []
  })

  const restaurantState = reactive({
    id: null,
    ownerId: null,
    name: '',
    address: '',
    minOrderSum: null,
    freeDeliveryFrom: null,
    loyaltyIsEnabled: false,
    cardIsEnabled: false,
    promoIsEnabled: false,
    loyaltyPercent: null,
    isPaused: false,
    isBanned: false,
    latitude: null,
    longitude: null,
    payoutInfo: '',
    cuisinesInput: '',
  })

  const workingHoursDayOptions = ref([
    {key: 'mon', label: 'Пн'},
    {key: 'tue', label: 'Вт'},
    {key: 'wed', label: 'Ср'},
    {key: 'thu', label: 'Чт'},
    {key: 'fri', label: 'Пт'},
    {key: 'sat', label: 'Сб'},
    {key: 'sun', label: 'Вс'},
  ])

  const workingHoursDays = reactive({
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  })

  const logoPhotoState = reactive({
    imageUrl: null,
    file: null,
    previewUrl: null,
  })

  const imagePhotoState = reactive({
    imageUrl: null,
    file: null,
    previewUrl: null,
  })

  const {
    imagePreviewSrc: logoPreviewSrc,
    onUpload: onLogoUpload,
    onClearUpload: onLogoClear,
    resetPhotoState: resetLogoPhotoState,
  } = usePhotoUtils(logoPhotoState, {getImagePath})

  const {
    imagePreviewSrc: imagePreviewSrc,
    onUpload: onImageUpload,
    onClearUpload: onImageClear,
    resetPhotoState: resetImagePhotoState,
  } = usePhotoUtils(imagePhotoState, {getImagePath})

  const resetPhotoState = () => {
    logoPhotoState.imageUrl = null
    imagePhotoState.imageUrl = null
    resetLogoPhotoState()
    resetImagePhotoState()
  }

  const resetWorkingHoursDays = () => {
    workingHoursDayOptions.value.forEach(day => {
      workingHoursDays[day.key] = []
    })
  }

  const hydrateWorkingHoursDays = workingHours => {
    resetWorkingHoursDays()

    if (!workingHours || typeof workingHours !== 'object') {
      return
    }

    workingHoursDayOptions.value.forEach(day => {
      const intervals = workingHours[day.key]?.open
      if (!Array.isArray(intervals)) {
        return
      }
      workingHoursDays[day.key] = intervals.map(interval => ({
        start: interval?.[0] ?? '',
        end: interval?.[1] ?? '',
      }))
    })
  }

  const addWorkingInterval = dayKey => {
    if (!workingHoursDays[dayKey]) {
      return
    }
    workingHoursDays[dayKey].push({start: '', end: ''})
  }

  const removeWorkingInterval = (dayKey, index) => {
    if (!workingHoursDays[dayKey]) {
      return
    }
    workingHoursDays[dayKey].splice(index, 1)
  }

  const resetRestaurantState = () => {
    restaurantState.id = null
    restaurantState.ownerId = null
    restaurantState.name = ''
    restaurantState.address = ''
    restaurantState.minOrderSum = null
    restaurantState.freeDeliveryFrom = null
    restaurantState.loyaltyIsEnabled = false
    restaurantState.cardIsEnabled = false
    restaurantState.promoIsEnabled = false
    restaurantState.loyaltyPercent = null
    restaurantState.isPaused = false
    restaurantState.isBanned = false
    restaurantState.latitude = null
    restaurantState.longitude = null
    restaurantState.payoutInfo = ''
    restaurantState.cuisinesInput = ''
    resetWorkingHoursDays()
    resetPhotoState()
  }

  const openNew = () => {
    resetRestaurantState()
    submitted.value = false
    showDetailDialog.value = true
    isEdit.value = false
  }

  const hideDialogs = () => {
    showDetailDialog.value = false
    isEdit.value = false
    submitted.value = false
    resetRestaurantState()
  }

  const editRestaurant = item => {
    resetRestaurantState()
    isEdit.value = true
    submitted.value = false
    restaurantState.id = item.id
    restaurantState.ownerId = item.ownerId ?? item.owner?.id ?? null
    restaurantState.name = item.name ?? ''
    restaurantState.address = item.address ?? ''
    restaurantState.minOrderSum = item.minOrderSum ?? null
    restaurantState.freeDeliveryFrom = item.freeDeliveryFrom ?? null
    hydrateWorkingHoursDays(item.workingHours)
    restaurantState.loyaltyIsEnabled = !!item.loyaltyIsEnabled
    restaurantState.cardIsEnabled = !!item.cardIsEnabled
    restaurantState.promoIsEnabled = !!item.promoIsEnabled
    restaurantState.loyaltyPercent = item.loyaltyPercent ?? null
    restaurantState.isPaused = !!item.isPaused
    restaurantState.isBanned = !!item.isBanned
    restaurantState.latitude = item.latitude ?? null
    restaurantState.longitude = item.longitude ?? null
    restaurantState.payoutInfo = item.payoutInfo ?? ''
    restaurantState.cuisinesInput = Array.isArray(item.cuisines)
        ? item.cuisines.map(cuisine => cuisine.name).filter(Boolean).join(', ')
        : ''
    logoPhotoState.imageUrl = item.logoUrl ?? null
    imagePhotoState.imageUrl = item.imageUrl ?? null
    resetLogoPhotoState()
    resetImagePhotoState()
    showDetailDialog.value = true
  }

  const toNumber = value => {
    if (value === null || value === undefined || value === '') {
      return 0
    }

    const parsed = Number(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  const parseCuisinesInput = (value, {wrapCuisine = false} = {}) => {
    if (!value || !value.trim()) {
      return []
    }

    return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .map(name => (wrapCuisine ? {cuisine: {name}} : {name}))
  }

  const buildWorkingHoursPayload = () => {
    const workingHours = {}
    let hasInvalidInterval = false

    workingHoursDayOptions.value.forEach(day => {
      const open = (workingHoursDays[day.key] || []).map(interval => {
        const start = interval.start?.trim() || ''
        const end = interval.end?.trim() || ''
        if (!start || !end) {
          hasInvalidInterval = true
        }
        return [start, end]
      })
      workingHours[day.key] = {open: open.filter(interval => interval[0] && interval[1])}
    })

    return {workingHours, hasInvalidInterval}
  }

  const {mutate: createRestaurant, isPending: isCreating} = create({
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Ресторан успешно добавлен',
        life: 3000,
      })
      hideDialogs()
    },
    onError: error => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: `Ошибка при отправке на сервер ${error}`,
        life: 3000,
      })
    },
  })

  const {mutate: updateRestaurant, isPending: isUpdating} = update({
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Ресторан успешно обновлен',
        life: 3000,
      })
      hideDialogs()
    },
    onError: error => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: `Ошибка при отправке на сервер ${error}`,
        life: 3000,
      })
    },
  })

  const {mutate: updateRestaurantImages, isPending: isUpdatingImages} = updateImages({
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Изображения ресторана обновлены',
        life: 3000,
      })
      resetLogoPhotoState()
      resetImagePhotoState()
    },
    onError: error => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: `Ошибка при обновлении изображений ${error}`,
        life: 3000,
      })
    },
  })

  const {mutate: deleteRestaurant, isPending: isDeleting} = deleteElement({
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Ресторан успешно удален',
        life: 3000,
      })
      showDeleteDialog.value = false
      deleteTargetId.value = null
    },
    onError: error => {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: `Ошибка при удалении ${error}`,
        life: 3000,
      })
    },
  })

  const sendData = () => {
    submitted.value = true

    if (!restaurantState.ownerId || !restaurantState.name || !restaurantState.address) {
      return
    }

    const {workingHours, hasInvalidInterval} = buildWorkingHoursPayload()
    if (hasInvalidInterval) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Заполните время начала и конца для всех интервалов',
        life: 3000,
      })
      return
    }

    const payload = {
      owner_id: toNumber(restaurantState.ownerId),
      name: restaurantState.name,
      address: restaurantState.address,
      min_order_sum: toNumber(restaurantState.minOrderSum),
      free_delivery_from: toNumber(restaurantState.freeDeliveryFrom),
      loyalty_is_enabled: restaurantState.loyaltyIsEnabled,
      card_is_enabled: restaurantState.cardIsEnabled,
      promo_is_enabled: restaurantState.promoIsEnabled,
      loyalty_percent: toNumber(restaurantState.loyaltyPercent),
      is_paused: restaurantState.isPaused,
      is_banned: restaurantState.isBanned,
      latitude: toNumber(restaurantState.latitude),
      longitude: toNumber(restaurantState.longitude),
      payout_info: restaurantState.payoutInfo,
      cuisines: parseCuisinesInput(restaurantState.cuisinesInput, {wrapCuisine: !isEdit.value}),
      working_hours: workingHours,
    }

    if (isEdit.value) {
      payload.restaurant_id = restaurantState.id
      updateRestaurant(payload)
      return
    }

    createRestaurant(payload)
  }

  const sendImages = () => {
    if (!restaurantState.id) {
      return
    }

    if (!logoPhotoState.file && !imagePhotoState.file) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Выберите логотип или изображение',
        life: 3000,
      })
      return
    }

    const formData = new FormData()
    formData.append('restaurant_id', restaurantState.id)
    if (logoPhotoState.file) {
      formData.append('logo_url', logoPhotoState.file)
    }
    if (imagePhotoState.file) {
      formData.append('image_url', imagePhotoState.file)
    }

    updateRestaurantImages(formData)
  }

  const confirmDelete = item => {
    deleteTargetId.value = item.id
    showDeleteDialog.value = true
  }

  const handleDeleteDialog = () => {
    if (!deleteTargetId.value) {
      return
    }
    deleteRestaurant(deleteTargetId.value)
  }

  const dayLabels = {
    mon: 'Пн',
    tue: 'Вт',
    wed: 'Ср',
    thu: 'Чт',
    fri: 'Пт',
    sat: 'Сб',
    sun: 'Вс',
    today: 'Сегодня',
  }

  const formatOpenIntervals = intervals => {
    if (!Array.isArray(intervals) || intervals.length === 0) {
      return 'Закрыто'
    }

    return intervals
        .map(interval => {
          if (!Array.isArray(interval) || interval.length < 2) {
            return '—'
          }
          const [start, end] = interval
          return `${start}-${end}`
        })
        .join(', ')
  }

  const formatWorkingHours = workingHours => {
    if (!workingHours || typeof workingHours !== 'object') {
      return []
    }

    const order = ['today', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

    return order
        .filter(key => key in workingHours)
        .map(key => ({
          label: dayLabels[key] || key,
          value: formatOpenIntervals(workingHours[key]?.open),
        }))
  }

  const formatBoolean = value => {
    if (value === null || value === undefined) {
      return '—'
    }

    return value ? 'Да' : 'Нет'
  }

  const formatCuisines = cuisines => {
    if (!Array.isArray(cuisines) || cuisines.length === 0) {
      return 'Нет данных'
    }

    return cuisines.map(cuisine => cuisine.name).join(', ')
  }

  const getWorkingHoursList = workingHours => formatWorkingHours(workingHours)

  const handleSearch = debounce(event => {
    filters.value.global.value = event.target.value
  }, 300)

  return {
    restaurantsList,
    isLoading,
    filters,
    expandedRows,
    showDetailDialog,
    showDeleteDialog,
    isEdit,
    submitted,
    restaurantState,
    deleteTargetId,
    workingHoursDayOptions,
    workingHoursDays,
    isCreating,
    isUpdating,
    isUpdatingImages,
    isDeleting,
    logoPreviewSrc,
    imagePreviewSrc,
    openNew,
    hideDialogs,
    editRestaurant,
    addWorkingInterval,
    removeWorkingInterval,
    sendData,
    sendImages,
    onLogoUpload,
    onLogoClear,
    onImageUpload,
    onImageClear,
    confirmDelete,
    handleDeleteDialog,
    handleSearch,
    formatBoolean,
    formatCuisines,
    getWorkingHoursList,
  }
})
