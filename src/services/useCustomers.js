import {createCustomer, deleteCustomer, getCustomers, updateCustomer} from '@/api/customers'
import {customersKeys} from '@/services/queryKeys'
import {useMutationWithInvalidate} from '@/services/useMutationWithInvalidate'
import {keepPreviousData, useQuery} from '@tanstack/vue-query'
import {computed} from 'vue'

const mapCustomer = customer => ({
    id: customer.id,
    phone: customer.phone,
    email: customer.email,
    role: customer.role,
    name: customer.name ?? '',
    avatarUrl: customer.avatar_url,
    loyaltyPoints: customer.loyalty_points,
})

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
                return data.map(mapCustomer)
            },
        })
    }

    const create = (options = {}) => {
        const {onSuccess, onError, ...mutationOptions} = options

        return useMutationWithInvalidate({
            mutationFn: customer => createCustomer(customer),
            invalidateKeys: [customersKeys.lists()],
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
            mutationFn: customer => updateCustomer(customer),
            invalidateKeys: [customersKeys.lists(), customersKeys.details()],
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
            mutationFn: userId => deleteCustomer(userId),
            invalidateKeys: [customersKeys.lists(), customersKeys.details()],
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
        deleteElement,
    }
}
