import {
    createRestaurant,
    deleteRestaurant,
    getRestaurantById,
    getRestaurants,
    updateRestaurant,
    updateRestaurantImages,
} from '@/api/restaurants'
import {restaurantsKeys} from '@/services/queryKeys'
import {useMutationWithInvalidate} from '@/services/useMutationWithInvalidate'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'

const mapRestaurant = restaurant => ({
    id: restaurant.id,
    ownerId: restaurant.owner_id ?? restaurant.owner?.id ?? null,
    owner: restaurant.owner
        ? {
            id: restaurant.owner.id,
            phone: restaurant.owner.phone,
            email: restaurant.owner.email,
            role: restaurant.owner.role,
            name: restaurant.owner.name,
            avatarUrl: restaurant.owner.avatar_url,
        }
        : null,
    name: restaurant.name,
    address: restaurant.address,
    logoUrl: restaurant.logo_url,
    imageUrl: restaurant.image_url,
    minOrderSum: restaurant.min_order_sum,
    freeDeliveryFrom: restaurant.free_delivery_from,
    rating: restaurant.rating,
    workingHours: restaurant.working_hours,
    loyaltyIsEnabled: restaurant.loyalty_is_enabled,
    cardIsEnabled: restaurant.card_is_enabled,
    promoIsEnabled: restaurant.promo_is_enabled,
    loyaltyPercent: restaurant.loyalty_percent,
    isPaused: restaurant.is_paused,
    isBanned: restaurant.is_banned,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    cuisines: Array.isArray(restaurant.cuisines)
        ? restaurant.cuisines.map(cuisine => ({
            name: cuisine.name,
        }))
        : [],
    payoutInfo: restaurant.payout_info,
})

export const useRestaurantsApi = () => {
    const getList = () => {
        return useQuery({
            queryKey: computed(() => restaurantsKeys.list()),
            queryFn: () => getRestaurants(),
            placeholderData: keepPreviousData,
            staleTime: 5 * 60 * 1000,
            select: data => {
                return data.map(mapRestaurant)
            },
        })
    }

    const create = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: restaurant => createRestaurant(restaurant),
            invalidateKeys: [restaurantsKeys.lists()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    const update = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: restaurant => updateRestaurant(restaurant),
            invalidateKeys: [restaurantsKeys.lists(), restaurantsKeys.details()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    const updateImages = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: payload => updateRestaurantImages(payload),
            invalidateKeys: [restaurantsKeys.lists(), restaurantsKeys.details()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    const deleteElement = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: restaurantId => deleteRestaurant(restaurantId),
            invalidateKeys: [restaurantsKeys.lists(), restaurantsKeys.details()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    return {
        getList,
        create,
        update,
        updateImages,
        deleteElement,
    }
}
