import axiosInst from '@/api/axios.instance'

const API_URL = '/restaurants/analytics'

export const getRestaurantAnalytics = (restaurantId, start_date, end_date) => {
    const params = {}
    params.restaurant_id = restaurantId

    if (start_date) {
        params.start_date = start_date
    }
    if (end_date) {
        params.end_date = end_date
    }

    return axiosInst
        .get(`${API_URL}`, {params})
        .then(res => res.data)
}
