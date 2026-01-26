// stores/auth.js
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {waitForRestaurantId} from "@/utils/restaurantId";
import {getRestaurantAnalytics} from "@/api/clientAnalytics";
import {getOrdersHistory} from "@/api/clientOrdersHistory";

export const useHistoryStore = defineStore('history', () => {
    const isLoading = ref(true);
    const historyData = ref({});
    const historyItems = ref([
        {
            id: '00001',
            time: '15:43',
            date: '14 ноября 2025',
            status: 'Доставлен',
            price: '1 240'
        },
        {
            id: '00002',
            time: '15:43',
            date: '14 ноября 2025',
            status: 'Доставлен',
            price: '1 240'
        },
        {
            id: '00003',
            time: '15:43',
            date: '14 ноября 2025',
            status: 'Доставлен',
            price: '1 240'
        },
        {
            id: '00004',
            time: '15:43',
            date: '14 ноября 2025',
            status: 'Доставлен',
            price: '1 240'
        },
    ])

    const countOrders = ref(521)
    const totalSum = ref('1 423 042 ₽')

    const filterStatuses = ref([
        {
            id: 'delivered',
            label: 'Доставлен',
        },
        {
            id: 'abandoned',
            label: 'Отказано',
        },
    ])
    const activeStatusIds = ref([])
    const activeDateRange = ref({
        start: null,
        end: null,
    })
    const draftStatusIds = ref([])
    const draftDateRange = ref({
        start: null,
        end: null,
    })

    const isStatusFilterActive = computed(() => activeStatusIds.value.length > 0)
    const isDateFilterActive = computed(() => !!(activeDateRange.value.start || activeDateRange.value.end))

    const monthShort = [
        'янв',
        'фев',
        'мар',
        'апр',
        'мая',
        'июн',
        'июл',
        'авг',
        'сен',
        'окт',
        'ноя',
        'дек',
    ]

    const cloneDate = (value) => (value ? new Date(value) : null)
    const cloneRange = (range) => ({
        start: cloneDate(range?.start),
        end: cloneDate(range?.end),
    })

    const formatChipDate = (value) => {
        if (!value) {
            return ''
        }

        return `${value.getDate()} ${monthShort[value.getMonth()]}`
    }

    const statusFilterLabel = computed(() => {
        if (!isStatusFilterActive.value) {
            return 'По статусу'
        }

        const labels = filterStatuses.value
            .filter((status) => activeStatusIds.value.includes(status.id))
            .map((status) => status.label)

        return labels.length ? labels.join(', ') : 'По статусу'
    })

    const dateFilterLabel = computed(() => {
        if (!isDateFilterActive.value) {
            return 'По дате'
        }

        const start = activeDateRange.value.start ? new Date(activeDateRange.value.start) : null
        const end = activeDateRange.value.end ? new Date(activeDateRange.value.end) : null

        if (start && end) {
            return `${formatChipDate(start)} - ${formatChipDate(end)}`
        }

        return formatChipDate(start || end) || 'По дате'
    })

    const setActiveStatusIds = (statuses) => {
        activeStatusIds.value = [...statuses]
    }

    const setActiveDateRange = (range) => {
        activeDateRange.value = {
            start: range?.start ? new Date(range.start) : null,
            end: range?.end ? new Date(range.end) : null,
        }
    }

    const mapHistoryData = (rawHistory) => ({
        totalRevenue: rawHistory?.total_revenue,
        totalOrders: rawHistory?.total_orders,
        orders: rawHistory?.orders?.map((order) => ({
            id: order?.id,
            status: order?.status,
            totalCost: order?.total_cost,
            foodCost: order?.food_cost,
            finishDate: order?.finished_at,
        })),
    })

    // Api usage
    const loadHistory = async () => {
        isLoading.value = true
        try {
            const restaurantId = await waitForRestaurantId()
            if (!restaurantId) return

            const data = await getOrdersHistory(restaurantId, activeStatusIds.value, activeDateRange.value.start, activeDateRange.value.end)
            historyData.value = mapHistoryData(data)
        } catch (error) {
            console.error('Failed to load orders history.', error)
        } finally {
            isLoading.value = false
        }
    }


    // UI Control
    const getModalInstance = (modalRef) => modalRef?.value ?? modalRef

    const openStatusModal = (modalRef) => {
        draftStatusIds.value = [...activeStatusIds.value]
        getModalInstance(modalRef)?.openModal?.()
    }

    const openDateModal = (modalRef) => {
        draftDateRange.value = cloneRange(activeDateRange.value)
        getModalInstance(modalRef)?.openModal?.()
    }

    const toggleStatus = (statusId) => {
        if (draftStatusIds.value.includes(statusId)) {
            draftStatusIds.value = draftStatusIds.value.filter((id) => id !== statusId)
            return
        }

        draftStatusIds.value = [...draftStatusIds.value, statusId]
    }

    const applyStatusFilter = async (modalRef) => {
        setActiveStatusIds(draftStatusIds.value)
        getModalInstance(modalRef)?.closeModal?.()
        await loadHistory()
    }

    const resetStatusFilter = (modalRef) => {
        draftStatusIds.value = []
        setActiveStatusIds([])
        getModalInstance(modalRef)?.closeModal?.()
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
        historyData,
        filterStatuses,
        activeStatusIds,
        activeDateRange,
        draftStatusIds,
        draftDateRange,
        isStatusFilterActive,
        isDateFilterActive,
        statusFilterLabel,
        dateFilterLabel,
        countOrders,
        totalSum,
        historyItems,
        setActiveStatusIds,
        setActiveDateRange,
        openStatusModal,
        openDateModal,
        toggleStatus,
        applyStatusFilter,
        resetStatusFilter,
        applyDateFilter,
        resetDateFilter,
        loadHistory
    }
})
