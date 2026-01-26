import axiosInst from '@/api/axios.instance'

const API_URL = '/user'

export const getUser = () => axiosInst.get(`${API_URL}/`).then(res => res.data)
