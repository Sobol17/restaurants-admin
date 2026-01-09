import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/users'

export const getCustomers = () => {
    return axiosInst
        .get(
            `${API_URL}`
        )
        .then(res => res.data)
}
