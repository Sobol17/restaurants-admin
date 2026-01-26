import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {getRestaurantReviews} from '@/api/clientReviews'
import {waitForRestaurantId} from '@/utils/restaurantId'

const buildFilters = () => ([
    {
        id: 'all',
        label: 'Все',
        value: null,
        showStar: false,
    },
    ...Array.from({length: 5}, (_, index) => ({
        id: `rating-${index + 1}`,
        label: String(index + 1),
        value: index + 1,
        showStar: true,
    })),
])

export const useOrderReviewsStore = defineStore('orderReviews', () => {
    const reviews = ref([])
    const isLoading = ref(false)

    const ratingFilters = ref(buildFilters())
    const activeRating = ref(null)

    const reviewsCount = computed(() => reviews.value.length)

    const averageRating = computed(() => {
        if (!reviews.value.length) {
            return 0
        }

        const sum = reviews.value.reduce((total, item) => total + item.rating, 0)
        return sum / reviews.value.length
    })

    const averageRatingLabel = computed(() => {
        if (!reviews.value.length) {
            return '0.0'
        }
        return averageRating.value.toFixed(1)
    })

    const filteredReviews = computed(() => {
        if (activeRating.value === null) {
            return reviews.value
        }

        return reviews.value.filter((item) => item.rating === activeRating.value)
    })

    const setRatingFilter = (value) => {
        activeRating.value = value
    }

    const setReviews = (items) => {
        reviews.value = Array.isArray(items) ? items : []
    }

    const mapReview = (review, index) => ({
        id: review?.id ?? review?.order_id ?? `review-${index}`,
        orderId: review?.order_id ?? 'не указан',
        time: review?.time ?? '00:00',
        date: review?.date ?? '01.01.2026',
        rating: Number(review?.rating ?? 0),
        comment: review?.comment ?? '—',
    })

    const loadReviews = async () => {
        isLoading.value = true
        try {
            const restaurantId = await waitForRestaurantId()
            if (!restaurantId) {
                setReviews([])
                return
            }
            const data = await getRestaurantReviews(restaurantId)
            const mapped = Array.isArray(data) ? data.map(mapReview) : []
            setReviews(mapped)
        } catch (error) {
            console.error('Failed to load restaurant reviews.', error)
            setReviews([])
        } finally {
            isLoading.value = false
        }
    }

    return {
        reviews,
        isLoading,
        ratingFilters,
        activeRating,
        reviewsCount,
        averageRatingLabel,
        filteredReviews,
        setRatingFilter,
        setReviews,
        loadReviews,
    }
})
