import {login, register} from '@/api/auth'
import router from '@/router'
import {useAuthStore} from '@/stores/auth'
import {authKeys} from '@/services/queryKeys'
import {useMutationWithInvalidate} from '@/services/useMutationWithInvalidate'

export const useAuthApi = (options = {}) => {
    const {onSuccess, onError, ...mutationOptions} = options
    const authStore = useAuthStore()

    const loginMutation = useMutationWithInvalidate({
        mutationFn: login,
        invalidateKeys: [authKeys.all],
        ...mutationOptions,
        onSuccess: (res, variables, context) => {
            if (res && res.access_token) {
                authStore.setAccessToken(res.access_token)
                router.replace({name: 'dashboard'})
            }

            if (onSuccess) {
                onSuccess(res, variables, context)
            }
        },
        onError: (error, variables, context) => {
            if (onError) {
                onError(error, variables, context)
            }
        },
    })

    const registerMutation = useMutationWithInvalidate({
        mutationFn: register,
        invalidateKeys: [authKeys.all],
        ...mutationOptions,
        onSuccess: (res, variables, context) => {
            if (res && res.access_token) {
                authStore.setAccessToken(res.access_token)
                router.replace({name: 'dashboard'})
            }

            if (onSuccess) {
                onSuccess(res, variables, context)
            }
        },
        onError: (error, variables, context) => {
            if (onError) {
                onError(error, variables, context)
            }
        },
    })

    return {
        loginMutation,
        registerMutation
    }
}
