import {getCustomers} from '@/api/customers'
import {customersKeys} from '@/services/queryKeys'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'

export const useCustomersApi = () => {
    const getList = () => {
        return useQuery({
            queryKey: computed(() =>
                customersKeys.list()
            ),
            queryFn: () => getCustomers(),
            placeholderData: keepPreviousData,
            staleTime: 5 * 60 * 1000,
            select: data => {
                return data.map(item => ({
                    id: item.id,
                    phone: item.phone,
                    email: item.email,
                    role: item.role,
                    name: item.email,
                    avatarUrl: item.avatar_url,
                    loyaltyPoints: item.loyalty_points,
                }))
            },
        })
    }

    return {
        getList
    }
}
