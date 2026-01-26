import axiosInst from '@/api/axios.instance'

const API_URL = '/restaurants/orders'

export const getRestaurantOrders = (restaurantId, {status, id} = {}) => {
  const params = {}
  if (restaurantId !== null && restaurantId !== undefined && restaurantId !== '') {
    params.restaurant_id = restaurantId
  }
  if (status) {
    params.status = status
  }
  if (id !== null && id !== undefined && id !== '') {
    params.id = id
  }

  return axiosInst
    .get(`${API_URL}/`, {params})
    .then(res => res.data)
}

export const updateRestaurantOrderStatus = payload =>
  axiosInst
    .post(`${API_URL}/status`, payload)
    .then(res => res.data)
