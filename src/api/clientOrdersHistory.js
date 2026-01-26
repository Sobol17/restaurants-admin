import axiosInst from '@/api/axios.instance'

const API_URL = '/restaurants/history'

export const getOrdersHistory = (restaurantId, status, start_date, end_date) => {
    const params = {}
    params.restaurant_id = restaurantId

    if (start_date) {
        params.start_date = start_date
    }
    if (end_date) {
        params.end_date = end_date
    }
    if (status) {
        params.status = status
    }

    return axiosInst
        .get(`${API_URL}`, {params})
        .then(res => res.data)
}
