import {
    createAd,
    deleteAd,
    getAds,
    updateAd
} from '@/api/ads'
import {adsKeys} from '@/services/queryKeys'
import {useMutationWithInvalidate} from '@/services/useMutationWithInvalidate'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'

export const useAdsApi = () => {
    const getList = () => {
        return useQuery({
            queryKey: computed(() =>
                adsKeys.list()
            ),
            queryFn: () => getAds(),
            placeholderData: keepPreviousData,
            staleTime: 5 * 60 * 1000,
            select: data => {
                return data.map(adItem => ({
                    id: adItem.id,
                    imageUrl: adItem.image_url,
                    link: adItem.link,
                }))
            },
        })
    }

    const create = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: ad => createAd(ad),
            invalidateKeys: [adsKeys.lists()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    const update = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: ad => updateAd(ad),
            invalidateKeys: [adsKeys.lists(), adsKeys.details()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    const deleteElement = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: adId => deleteAd(adId),
            invalidateKeys: [adsKeys.lists(), adsKeys.details()],
            ...mutationOptions,
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context)
                }
            },
            onError: (error, variables, context) => {
                if (onError) {
                    onError(error, variables, context)
                }
            },
        })
    }

    return {
        getList,
        create,
        update,
        deleteElement
    }
}
