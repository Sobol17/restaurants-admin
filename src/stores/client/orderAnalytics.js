import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {waitForRestaurantId} from "@/utils/restaurantId";
import {getRestaurantAnalytics} from "@/api/clientAnalytics";

const toDate = (value) => (value ? new Date(value) : null)

const cloneRange = (range) => ({
    start: toDate(range?.start),
    end: toDate(range?.end),
})

const formatDate = (value) => {
    if (!value) {
        return '--.--.----'
    }

    const day = String(value.getDate()).padStart(2, '0')
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const year = value.getFullYear()
    return `${day}.${month}.${year}`
}

export const useOrderAnalyticsStore = defineStore('orderAnalytics', () => {
    const analytics = ref({})

    const isLoading = ref(false)

    const activeDateRange = ref({
        start: new Date(2025, 12, 11),
        end: new Date(2026, 1, 1),
    })
    const draftDateRange = ref(cloneRange(activeDateRange.value))

    const dateStartLabel = computed(() => `с ${formatDate(activeDateRange.value.start)}`)
    const dateEndLabel = computed(() => `до ${formatDate(activeDateRange.value.end)}`)

    const mapAnalytics = (rawData) => ({
        totalRevenue: rawData?.total_revenue,
        averageBill: rawData?.average_bill,
        totalOrders: rawData?.total_orders,
        popularDishes: rawData?.popular_dishes?.map((dishItem) => ({
            name: dishItem?.dish?.name,
            id: dishItem?.dish?.id,
            totalOrdered: dishItem?.total_ordered
        })),
    })

    const loadAnalytics = async () => {
        isLoading.value = true
        try {
            const restaurantId = await waitForRestaurantId()
            if (!restaurantId) return

            const data = await getRestaurantAnalytics(restaurantId, activeDateRange.value.start, activeDateRange.value.end)
            analytics.value = mapAnalytics(data)
        } catch (error) {
            console.error('Failed to load restaurant analytics.', error)
        } finally {
            isLoading.value = false
        }
    }

    const setActiveDateRange = async (range) => {
        activeDateRange.value = {
            start: range?.start ? new Date(range.start) : null,
            end: range?.end ? new Date(range.end) : null,
        }

        await loadAnalytics()
    }

    // UI control
    const getModalInstance = (modalRef) => modalRef?.value ?? modalRef

    const openDateModal = (modalRef) => {
        draftDateRange.value = cloneRange(activeDateRange.value)
        getModalInstance(modalRef)?.openModal?.()
    }

    const applyDateFilter = (modalRef) => {
        setActiveDateRange(draftDateRange.value)
        getModalInstance(modalRef)?.closeModal?.()
    }

    const resetDateFilter = (modalRef) => {
        draftDateRange.value = {
            start: null,
            end: null,
        }
        setActiveDateRange(draftDateRange.value)
        getModalInstance(modalRef)?.closeModal?.()
    }

    return {
        analytics,
        loadAnalytics,
        activeDateRange,
        draftDateRange,
        dateStartLabel,
        dateEndLabel,
        openDateModal,
        applyDateFilter,
        resetDateFilter,
    }
})
