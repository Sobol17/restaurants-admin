import {useMutation, useQueryClient} from '@tanstack/vue-query'

export const useMutationWithInvalidate = ({
    mutationFn,
    invalidateKeys = [],
    onSuccess,
    onError,
    ...options
}) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,
        ...options,
        onSuccess: (data, variables, context) => {
            invalidateKeys.forEach(queryKey => {
                if (!queryKey) {
                    return
                }

                queryClient.invalidateQueries({queryKey})
            })

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
