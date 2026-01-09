import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/couriers'

export const getCouriers = () => {
    return axiosInst
        .get(
            `${API_URL}`
        )
        .then(res => res.data)
}
