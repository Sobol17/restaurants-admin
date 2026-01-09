import {couriersKeys} from '@/services/queryKeys'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'
import {getCouriers} from "@/api/couriers";

export const useCouriersApi = () => {
    const getList = () => {
        return useQuery({
            queryKey: computed(() =>
                couriersKeys.list()
            ),
            queryFn: () => getCouriers(),
            placeholderData: keepPreviousData,
            staleTime: 5 * 60 * 1000,
            select: data => {
                return data.map(item => ({
                    id: item.id,
                    currentLat: item.current_lat,
                    currentLng: item.current_lng,
                    isAvailable: item.is_available,
                    payoutInfo: item.payout_info,
                    user: {
                        id: item.user?.id,
                        phone: item.user?.phone,
                        name: item.user?.name,
                        email: item.user?.email,
                        avatarUrl: item.user?.avatar_url,
                    },
                }))
            },
        })
    }

    return {
        getList
    }
}
