import {defineStore} from 'pinia'
import {computed, reactive, ref, watch} from 'vue'
import {FilterMatchMode} from '@primevue/core/api'
import {debounce} from '@/utils/debounce'
import {useOrdersApi} from '@/services/useOrders'

const normalizeNumber = value => {
    if (value === null || value === undefined || value === '') {
        return null
    }

    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
}

const normalizeText = value => {
    if (value === null || value === undefined) {
        return null
    }

    const trimmed = String(value).trim()
    return trimmed ? trimmed : null
}

const formatDateValue = value => {
    if (!value) {
        return null
    }

    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            return null
        }
        const year = value.getFullYear()
        const month = String(value.getMonth() + 1).padStart(2, '0')
        const day = String(value.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return normalizeText(value)
}

export const useOrdersStore = defineStore('orders', () => {
    const {getList} = useOrdersApi()

    const queryFilters = reactive({
        id: null,
        customerId: null,
        restaurantId: null,
        courierId: null,
        phone: null,
        status: null,
        startDate: null,
        endDate: null,
    })

    const queryFiltersSnapshot = computed(() => ({
        id: queryFilters.id,
        customerId: queryFilters.customerId,
        restaurantId: queryFilters.restaurantId,
        courierId: queryFilters.courierId,
        phone: queryFilters.phone,
        status: queryFilters.status,
        startDate: queryFilters.startDate,
        endDate: queryFilters.endDate,
    }))

    const {data: ordersData, isLoading} = getList(queryFiltersSnapshot)

    const filterState = reactive({
        id: '',
        customerId: '',
        restaurantId: '',
        courierId: '',
        phone: '',
        status: '',
        startDate: null,
        endDate: null,
    })

    const expandedRows = ref([])

    const filters = ref({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    const ordersList = computed(() => {
        return ordersData?.value || []
    })

    const applyFilters = () => {
        queryFilters.id = normalizeNumber(filterState.id)
        queryFilters.customerId = normalizeNumber(filterState.customerId)
        queryFilters.restaurantId = normalizeNumber(filterState.restaurantId)
        queryFilters.courierId = normalizeNumber(filterState.courierId)
        queryFilters.phone = normalizeText(filterState.phone)
        queryFilters.status = normalizeText(filterState.status)
        queryFilters.startDate = formatDateValue(filterState.startDate)
        queryFilters.endDate = formatDateValue(filterState.endDate)
    }

    const resetFilters = () => {
        filterState.id = ''
        filterState.customerId = ''
        filterState.restaurantId = ''
        filterState.courierId = ''
        filterState.phone = ''
        filterState.status = ''
        filterState.startDate = null
        filterState.endDate = null
        applyFilters()
    }

    const handleSearch = debounce(event => {
        filters.value.global.value = event.target.value
    }, 300)

    watch(
        () => [filterState.startDate, filterState.endDate],
        () => {
            applyFilters()
        },
    )

    return {
        ordersList,
        isLoading,
        filters,
        expandedRows,
        filterState,
        applyFilters,
        resetFilters,
        handleSearch,
    }
})
