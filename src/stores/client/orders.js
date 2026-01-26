import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {getRestaurantOrders, updateRestaurantOrderStatus} from '@/api/clientOrders'
import {waitForRestaurantId} from '@/utils/restaurantId'

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

const categoryDefinitions = [
    {
        id: 'new',
        label: 'Новые',
        statuses: ['ACCEPTED_BY_RESTAURANT'],
    },
    {
        id: 'in_progress',
        label: 'В работе',
        statuses: ['COOKING', 'ACCEPTED_BY_COURIER', 'COURIER_PICKED_UP', 'COURIER_ON_WAY'],
    },
    {
        id: 'waiting_courier',
        label: 'Ожидает курьера',
        statuses: ['WAITING_COURIER'],
    },
    {
        id: 'completed',
        label: 'Выполнен',
        statuses: ['DELIVERED', 'CANCELLED'],
    },
]

const formatOrderNumber = (id) => {
    if (id === null || id === undefined) {
        return '—'
    }
    return String(id).padStart(5, '0')
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
        image: item?.dish?.images_urls?.[0] ?? 'https://placehold.co/120x120?text=Food',
    }))
}

const mapOrder = (order) => ({
    id: order.id,
    status: statusLabels[order.status] ?? 'Не назначен',
    statusCode: order.status ?? null,
    price: order.total_cost ?? 0,
    items: buildOrderItems(order),
    orderNumber: formatOrderNumber(order.id),
    orderTime: formatOrderTime(order.finished_at),
    payment: order.use_loyalty_points
        ? 'Оплата баллами'
        : 'Способ оплаты не указан',
    address: order.delivery_address ?? '—',
    note: order.comment ?? '—',
})

const dedupeOrders = (items) => {
    const seen = new Set()
    return items.filter((order) => {
        const id = order?.id
        if (id === null || id === undefined) {
            return true
        }
        if (seen.has(id)) {
            return false
        }
        seen.add(id)
        return true
    })
}

export const useClientOrdersStore = defineStore('clientOrders', () => {
    const orders = ref([])
    const isLoading = ref(false)
    const loadError = ref('')
    const isUpdating = ref(false)
    const updateError = ref('')
    const activeCategoryId = ref('new')

    const categories = computed(() => (
        categoryDefinitions.map((definition) => {
            const count = orders.value.filter(order => definition.statuses.includes(order?.status)).length
            return {
                id: definition.id,
                label: definition.label,
                count,
            }
        })
    ))

    const filteredOrders = computed(() => {
        const definition = categoryDefinitions.find(item => item.id === activeCategoryId.value)
        const source = definition
            ? orders.value.filter(order => definition.statuses.includes(order?.status))
            : orders.value
        return source.map(mapOrder)
    })

    const setActiveCategory = (id) => {
        if (categoryDefinitions.some(item => item.id === id)) {
            activeCategoryId.value = id
        }
    }

    const ensureActiveCategory = () => {
        const activeDefinition = categoryDefinitions.find(item => item.id === activeCategoryId.value)
        const hasActiveOrders = activeDefinition
            ? orders.value.some(order => activeDefinition.statuses.includes(order?.status))
            : false

        if (hasActiveOrders) {
            return
        }

        const firstWithOrders = categoryDefinitions.find(definition =>
            orders.value.some(order => definition.statuses.includes(order?.status))
        )
        activeCategoryId.value = firstWithOrders?.id ?? categoryDefinitions[0]?.id ?? 'new'
    }

    const loadOrders = async () => {
        if (isLoading.value) {
            return
        }
        isLoading.value = true
        loadError.value = ''
        try {
            const restaurantId = await waitForRestaurantId()
            if (!restaurantId) {
                orders.value = []
                return
            }

            const statuses = [...new Set(categoryDefinitions.flatMap(definition => definition.statuses))]
            const responses = await Promise.all(
                statuses.map(status => getRestaurantOrders(restaurantId, {status}))
            )

            const combined = responses.flatMap((data) => (Array.isArray(data) ? data : []))
            orders.value = dedupeOrders(combined)
            ensureActiveCategory()
        } catch (error) {
            console.error('Failed to load restaurant orders.', error)
            loadError.value = 'Failed to load restaurant orders.'
            orders.value = []
        } finally {
            isLoading.value = false
        }
    }

    const updateOrderStatus = async ({
        orderId,
        status,
        cookTimeMinutes,
        errorMessage,
    } = {}) => {
        if (isUpdating.value) {
            return false
        }

        updateError.value = ''
        isUpdating.value = true
        try {
            if (!orderId || !status) {
                throw new Error('orderId and status are required.')
            }

            const payload = {
                order_id: orderId,
                status,
            }

            if (status === 'COOKING') {
                const minutes = Number(cookTimeMinutes)
                if (!Number.isFinite(minutes) || minutes <= 0) {
                    throw new Error('cook_time_minutes must be a positive number.')
                }
                payload.cook_time_minutes = minutes
            }

            await updateRestaurantOrderStatus(payload)
            await loadOrders()
            return true
        } catch (error) {
            updateError.value = errorMessage || 'Failed to update order status.'
            console.error(updateError.value, error)
            return false
        } finally {
            isUpdating.value = false
        }
    }

    return {
        orders,
        categories,
        filteredOrders,
        activeCategoryId,
        isLoading,
        loadError,
        isUpdating,
        updateError,
        loadOrders,
        setActiveCategory,
        updateOrderStatus,
    }
})
