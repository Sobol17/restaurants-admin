import axiosInst from '@/api/axios.instance'

const API_URL = '/restaurants'

export const getRestaurantProfile = restaurantId =>
    axiosInst
        .get(`${API_URL}/get`, {params: {restaurant_id: restaurantId}})
        .then(res => res.data)

export const updateRestaurantSettings = payload =>
    axiosInst
        .post(`${API_URL}/settings`, payload)
        .then(res => res.data)

export const updateRestaurantImages = payload =>
    axiosInst
        .post(`${API_URL}/settings/images`, payload)
        .then(res => res.data)
