import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/restaurants'

export const getRestaurants = () => {
    return axiosInst
        .get(`${API_URL}/`)
        .then(res => res.data)
}

export const getRestaurantById = id =>
    axiosInst.get(`${API_URL}/${id}`).then(res => res.data)

export const createRestaurant = requestBody =>
    axiosInst.post(`${API_URL}/add`, requestBody).then(res => res.data)

export const updateRestaurant = requestBody => {
    const {restaurant_id: restaurantId, ...payload} = requestBody ?? {}
    const hasRestaurantId = restaurantId !== null && restaurantId !== undefined
    const query = hasRestaurantId ? `?restaurant_id=${restaurantId}` : ''

    return axiosInst.post(`${API_URL}/update${query}`, payload).then(res => res.data)
}

export const updateRestaurantImages = requestBody =>
    axiosInst.post(`${API_URL}/update/images`, requestBody).then(res => res.data)

export const deleteRestaurant = id =>
    axiosInst.post(`${API_URL}/remove?restaurant_id=${id}`).then(res => res.data)
