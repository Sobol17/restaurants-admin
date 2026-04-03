import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/users'
const USER_API_URL = '/admin/user'

export const getCustomers = () => {
    return axiosInst
        .get(
            `${API_URL}`
        )
        .then(res => res.data)
}

export const createCustomer = requestBody =>
    axiosInst.post(`${USER_API_URL}/create`, requestBody).then(res => res.data)

export const updateCustomer = requestBody => {
    const {user_id: userId, ...payload} = requestBody ?? {}
    const hasUserId = userId !== null && userId !== undefined
    const query = hasUserId ? `?user_id=${userId}` : ''

    return axiosInst.post(`${USER_API_URL}/update${query}`, payload).then(res => res.data)
}

export const deleteCustomer = id =>
    axiosInst.post(`${USER_API_URL}/remove?user_id=${id}`).then(res => res.data)
