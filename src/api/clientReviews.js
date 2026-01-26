import axiosInst from '@/api/axios.instance'

const API_URL = '/restaurants/reviews'

export const getRestaurantReviews = restaurantId => {
    const params = {}
    params.restaurant_id = restaurantId

    return axiosInst
        .get(`${API_URL}`, {params})
        .then(res => res.data)
}
