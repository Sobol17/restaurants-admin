import {getOrders} from '@/api/orders'
import {ordersKeys} from '@/services/queryKeys'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'

const mapOrder = order => ({
    id: order.id,
    customerId: order.customer_id ?? null,
    restaurantId: order.restaurant_id ?? null,
    courierId: order.courier_id ?? null,
    phone: order.phone,
    comment: order.comment,
    foodCost: order.food_cost,
    deliveryCost: order.delivery_cost,
    useLoyaltyPoints: order.use_loyalty_points,
    totalCost: order.total_cost,
    deliveryAddress: order.delivery_address,
    latitude: order.latitude,
    longitude: order.longitude,
    cookTimeMinutes: order.cook_time_minutes,
    finishedAt: order.finished_at,
    status: order.status,
    review: order.review
        ? {
            restaurantId: order.review.restaurant_id ?? null,
            orderId: order.review.order_id ?? null,
            rating: order.review.rating,
            comment: order.review.comment,
        }
        : null,
    items: Array.isArray(order.items)
        ? order.items.map(item => ({
            id: item.id,
            orderId: item.order_id ?? null,
            quantity: item.quantity,
            dish: item.dish
                ? {
                    id: item.dish.id,
                    restaurantId: item.dish.restaurant_id ?? null,
                    name: item.dish.name,
                    price: item.dish.price,
                    description: item.dish.description,
                    imagesUrls: item.dish.images_urls ?? [],
                    category: item.dish.category
                        ? {
                            id: item.dish.category.id,
                            name: item.dish.category.name,
                            imageUrl: item.dish.category.image_url,
                        }
                        : null,
                    isPaused: item.dish.is_paused,
                }
                : null,
        }))
        : [],
})

export const useOrdersApi = () => {
    const getList = (filters = computed(() => ({}))) => {
        const normalizedFilters = computed(() => {
            if (filters && 'value' in filters) {
                return filters.value
            }

            return filters ?? {}
        })

        return useQuery({
            queryKey: computed(() => ordersKeys.list(normalizedFilters.value)),
            queryFn: () => getOrders(normalizedFilters.value),
            placeholderData: keepPreviousData,
            staleTime: 5 * 60 * 1000,
            select: data => {
                return data.map(mapOrder)
            },
        })
    }

    return {
        getList,
    }
}
