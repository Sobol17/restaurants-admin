import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/orders'

const buildOrdersParams = filters => {
    if (!filters) {
        return {}
    }

    const params = {}

    if (filters.id !== null && filters.id !== undefined && filters.id !== '') {
        params.id = filters.id
    }
    if (filters.customerId !== null && filters.customerId !== undefined && filters.customerId !== '') {
        params.customer_id = filters.customerId
    }
    if (filters.restaurantId !== null && filters.restaurantId !== undefined && filters.restaurantId !== '') {
        params.restaurant_id = filters.restaurantId
    }
    if (filters.courierId !== null && filters.courierId !== undefined && filters.courierId !== '') {
        params.courier_id = filters.courierId
    }
    if (filters.phone) {
        params.phone = filters.phone
    }
    if (filters.status) {
        params.status = filters.status
    }
    if (filters.startDate) {
        params.start_date = filters.startDate
    }
    if (filters.endDate) {
        params.end_date = filters.endDate
    }

    return params
}

export const getOrders = filters => {
    return axiosInst
        .get(`${API_URL}`, {params: buildOrdersParams(filters)})
        .then(res => res.data)
}
