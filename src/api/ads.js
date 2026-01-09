import axiosInst from '@/api/axios.instance'

const API_URL = '/admin/ads'

export const getAds = () => {
    return axiosInst
        .get(
            `${API_URL}/`
        )
        .then(res => res.data)
}

export const getAdById = id =>
    axiosInst.get(`${API_URL}/${id}`).then(res => res.data)

export const createAd = requestBody =>
    axiosInst.post(`${API_URL}/add`, requestBody).then(res => res.data)

export const updateAd = requestBody =>
    axiosInst.post(`${API_URL}/update`, requestBody).then(res => res.data)

export const deleteAd = id =>
    axiosInst.post(`${API_URL}/remove?ad_id=${id}`).then(res => res.data)
