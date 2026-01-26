import {defineStore} from 'pinia'
import {computed, reactive, ref} from 'vue'
import {getRestaurantOrders} from '@/api/clientOrders'
import {useClientOrdersStore} from '@/stores/client/orders'

const statusLabels = {
    ACCEPTED_BY_RESTAURANT: 'Принят',
    COOKING: 'Готовится',
    WAITING_COURIER: 'Ожидает курьера',
    ACCEPTED_BY_COURIER: 'Принят курьером',
    COURIER_PICKED_UP: 'Забрал курьер',
    COURIER_ON_WAY: 'В пути',
    DELIVERED: 'Доставлен',
    CANCELLED: 'Отменен',
}

const normalizeDigits = (value) => {
    if (value === null || value === undefined) {
        return ''
    }

    return String(value).replace(/[^\d]/g, '')
}

const formatOrderNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—'
    }
    return String(value).padStart(5, '0')
}

const formatOrderTime = (timestamp) => {
    if (!timestamp) {
        return '—'
    }
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000
    const date = new Date(ms)
    if (Number.isNaN(date.getTime())) {
        return '—'
    }
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const buildOrderItems = (order) => {
    if (!Array.isArray(order?.items)) {
        return []
    }

    return order.items.map((item, index) => ({
        id: item?.id ?? item?.dish?.id ?? `${order.id}-${index}`,
        title: item?.dish?.name ?? 'Блюдо',
        image: item?.dish?.images_urls?.[0] ?? 'https://placehold.co/160x160?text=Food',
    }))
}

export const useOrderDetailStore = defineStore('orderDetail', () => {
    const ordersStore = useClientOrdersStore()
    const orderId = ref(null)
    const statusCode = ref('ACCEPTED_BY_RESTAURANT')
    const isLoading = ref(false)
    const loadError = ref('')

    const order = reactive({
        number: '00001',
        time: '12:54, 12 ноября 2025 года',
        payment: {
            method: 'Оплата наличными',
            status: 'Не оплачено',
        },
        address: 'Ул. Гоголя, д.24, кв. 45',
        phone: '8 (707) 452-53-43',
        comment: 'Домофон находится со стороны аптеки',
        total: 2520,
        status: statusLabels[statusCode.value] ?? 'Не назначен',
        items: [
            {
                id: 1,
                title: 'Pepperoni Cheese Pizza',
                image: 'https://placehold.co/160x160?text=Pizza',
            },
            {
                id: 2,
                title: 'Pepperoni Cheese Pizza',
                image: 'https://placehold.co/160x160?text=Pizza',
            },
            {
                id: 3,
                title: 'Pepperoni Cheese Pizza',
                image: 'https://placehold.co/160x160?text=Pizza',
            },
        ],
    })

    const isReadyTimeModalOpen = ref(false)
    const readyMinutes = ref('')
    const isUpdating = computed(() => ordersStore.isUpdating)

    const infoRows = computed(() => ([
        {
            id: 'number',
            icon: 'document',
            text: order.number,
        },
        {
            id: 'time',
            icon: 'clock',
            text: order.time,
        },
        {
            id: 'payment',
            icon: 'payment',
            text: order.payment.method,
            meta: `(${order.payment.status})`,
        },
        {
            id: 'address',
            icon: 'location',
            text: order.address,
        },
        {
            id: 'phone',
            icon: 'phone',
            text: order.phone,
        },
    ]))

    const statusLabel = computed(() => statusLabels[statusCode.value] ?? order.status)

    const statusTone = computed(() => {
        if (statusCode.value === 'CANCELLED') {
            return 'danger'
        }
        if (statusCode.value === 'WAITING_COURIER') {
            return 'success'
        }
        return 'muted'
    })

    const actionState = computed(() => {
        if (statusCode.value === 'CANCELLED') {
            return {
                variant: 'none',
            }
        }

        if (statusCode.value === 'WAITING_COURIER') {
            return {
                variant: 'single',
                label: 'Заказ готов',
                disabled: true,
            }
        }

        if (statusCode.value === 'COOKING') {
            return {
                variant: 'single',
                label: 'Заказ готов',
                disabled: isUpdating.value,
            }
        }

        if (statusCode.value && statusCode.value !== 'ACCEPTED_BY_RESTAURANT') {
            return {
                variant: 'none',
            }
        }

        return {
            variant: 'double',
            primaryLabel: 'Принять',
            secondaryLabel: 'Отклонить',
        }
    })

    const canConfirmReadyTime = computed(() => {
        const minutes = Number(readyMinutes.value)
        return Number.isFinite(minutes) && minutes > 0 && !isUpdating.value
    })

    const applyOrderData = (data) => {
        if (!data) {
            return
        }

        setOrderId(data.id)
        if (data.status) {
            setStatusCode(data.status)
        }

        order.time = formatOrderTime(data.finished_at ?? data.created_at ?? data.createdAt)
        order.payment.method = data.use_loyalty_points
            ? 'Оплата баллами'
            : 'Способ оплаты не указан'
        order.payment.status = data.payment_status ?? 'Не оплачено'
        order.address = data.delivery_address ?? '—'
        order.phone = data.phone ?? '—'
        order.comment = data.comment ?? '—'
        order.total = data.total_cost ?? 0
        order.items = buildOrderItems(data)
    }

    const loadOrder = async () => {
        if (!orderId.value) {
            return
        }

        isLoading.value = true
        loadError.value = ''
        try {
            const data = await getRestaurantOrders(undefined, {id: orderId.value})
            const item = Array.isArray(data) ? data[0] : null
            if (!item) {
                loadError.value = 'Заказ не найден.'
                return
            }
            applyOrderData(item)
        } catch (error) {
            console.error('Failed to load restaurant order.', error)
            loadError.value = 'Не удалось загрузить заказ.'
        } finally {
            isLoading.value = false
        }
    }

    const setStatusCode = (value) => {
        if (!value) {
            return
        }
        statusCode.value = value
        order.status = statusLabels[value] ?? order.status
    }

    const setOrderId = (value) => {
        if (value === null || value === undefined || value === '') {
            orderId.value = null
            return
        }
        orderId.value = value
        order.number = formatOrderNumber(value)
    }

    const setReadyMinutes = (value) => {
        readyMinutes.value = normalizeDigits(value)
    }

    const openReadyTimeModal = () => {
        if (isUpdating.value || statusCode.value !== 'ACCEPTED_BY_RESTAURANT') {
            return
        }
        isReadyTimeModalOpen.value = true
    }

    const cancelReadyTime = () => {
        isReadyTimeModalOpen.value = false
        readyMinutes.value = ''
    }

    const updateStatus = async ({status, cookTimeMinutes, errorMessage} = {}) => {
        if (!orderId.value || !status) {
            return false
        }

        return ordersStore.updateOrderStatus({
            orderId: orderId.value,
            status,
            cookTimeMinutes,
            errorMessage,
        })
    }

    const confirmReadyTime = async () => {
        if (!canConfirmReadyTime.value) {
            return
        }

        const success = await updateStatus({
            status: 'COOKING',
            cookTimeMinutes: readyMinutes.value,
            errorMessage: 'Не удалось принять заказ.',
        })

        if (success) {
            setStatusCode('COOKING')
            isReadyTimeModalOpen.value = false
            readyMinutes.value = ''
        }
    }

    const declineOrder = async () => {
        if (isUpdating.value) {
            return
        }

        const success = await updateStatus({
            status: 'CANCELLED',
            errorMessage: 'Не удалось отклонить заказ.',
        })

        if (success) {
            setStatusCode('CANCELLED')
            isReadyTimeModalOpen.value = false
            readyMinutes.value = ''
        }
    }

    const markOrderReady = async () => {
        if (isUpdating.value || statusCode.value !== 'COOKING') {
            return
        }

        const success = await updateStatus({
            status: 'WAITING_COURIER',
            errorMessage: 'Не удалось обновить статус заказа.',
        })

        if (success) {
            setStatusCode('WAITING_COURIER')
        }
    }

    const triggerPrimaryAction = () => {
        if (isUpdating.value) {
            return
        }

        if (actionState.value.variant === 'double') {
            openReadyTimeModal()
            return
        }

        if (actionState.value.variant === 'single') {
            markOrderReady()
        }
    }

    const triggerSecondaryAction = () => {
        if (isUpdating.value) {
            return
        }

        if (actionState.value.variant === 'double') {
            declineOrder()
        }
    }

    return {
        order,
        orderId,
        infoRows,
        isReadyTimeModalOpen,
        readyMinutes,
        statusLabel,
        statusTone,
        actionState,
        canConfirmReadyTime,
        isUpdating,
        isLoading,
        loadError,
        setOrderId,
        setStatusCode,
        setReadyMinutes,
        openReadyTimeModal,
        cancelReadyTime,
        confirmReadyTime,
        loadOrder,
        triggerPrimaryAction,
        triggerSecondaryAction,
    }
})
