import {defineStore} from 'pinia'
import {computed, reactive, ref} from 'vue'
import {FilterMatchMode} from '@primevue/core/api'
import {debounce} from '@/utils/debounce'
import {useCustomersApi} from '@/services/useCustomers'

export const useCustomersStore = defineStore('customers', () => {
    const {getList, create, update, deleteElement} = useCustomersApi()
    const {data: customersData, isLoading} = getList()

    const showDetailDialog = ref(false)
    const showDeleteDialog = ref(false)
    const isEdit = ref(false)
    const submitted = ref(false)
    const expandedRows = ref([])
    const deleteTargetId = ref(null)
    const requestStatus = ref(null)

    const filters = ref({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    const roleOptions = ref([
        {label: 'Клиент', value: 'customer'},
        {label: 'Курьер', value: 'courier'},
        {label: 'Владелец ресторана', value: 'restaurant_owner'},
        {label: 'Менеджер', value: 'manager'},
        {label: 'Администратор', value: 'admin'},
    ])

    const customerState = reactive({
        id: null,
        phone: '',
        email: '',
        password: '',
        role: 'customer',
        name: '',
        avatarUrl: '',
    })

    const customersList = computed(() => {
        return customersData?.value || []
    })

    const setRequestStatus = (severity, label) => {
        requestStatus.value = {
            severity,
            label,
        }
    }

    const getErrorMessage = error => {
        const responseData = error?.response?.data

        if (typeof responseData === 'string' && responseData) {
            return responseData
        }

        if (responseData?.message) {
            return responseData.message
        }

        if (responseData?.detail) {
            return responseData.detail
        }

        return error?.message || 'Неизвестная ошибка'
    }

    const resetCustomerState = () => {
        customerState.id = null
        customerState.phone = ''
        customerState.email = ''
        customerState.password = ''
        customerState.role = 'customer'
        customerState.name = ''
        customerState.avatarUrl = ''
    }

    const sanitizePayload = payload => {
        return Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined),
        )
    }

    const formatRoleLabel = role => {
        return roleOptions.value.find(option => option.value === role)?.label ?? role ?? '—'
    }

    const openNew = () => {
        resetCustomerState()
        submitted.value = false
        showDetailDialog.value = true
        isEdit.value = false
    }

    const hideDialogs = () => {
        showDetailDialog.value = false
        showDeleteDialog.value = false
        isEdit.value = false
        submitted.value = false
        deleteTargetId.value = null
        resetCustomerState()
    }

    const editCustomer = item => {
        resetCustomerState()
        isEdit.value = true
        submitted.value = false
        customerState.id = item.id
        customerState.phone = item.phone ?? ''
        customerState.email = item.email ?? ''
        customerState.password = ''
        customerState.role = item.role ?? 'customer'
        customerState.name = item.name ?? ''
        customerState.avatarUrl = item.avatarUrl ?? ''
        showDetailDialog.value = true
    }

    const buildPayload = () => {
        const password = customerState.password.trim()

        return sanitizePayload({
            phone: customerState.phone.trim(),
            email: customerState.email.trim(),
            password: password || (isEdit.value ? undefined : ''),
            role: customerState.role,
            name: customerState.name.trim(),
            avatar_url: customerState.avatarUrl.trim(),
        })
    }

    const {mutate: createCustomer, isPending: isCreating} = create({
        onSuccess: () => {
            setRequestStatus('success', 'Пользователь успешно добавлен')
            hideDialogs()
        },
        onError: error => {
            setRequestStatus('danger', `Ошибка добавления: ${getErrorMessage(error)}`)
        },
    })

    const {mutate: updateCustomer, isPending: isUpdating} = update({
        onSuccess: () => {
            setRequestStatus('success', 'Пользователь успешно обновлен')
            hideDialogs()
        },
        onError: error => {
            setRequestStatus('danger', `Ошибка обновления: ${getErrorMessage(error)}`)
        },
    })

    const {mutate: deleteCustomer, isPending: isDeleting} = deleteElement({
        onSuccess: () => {
            setRequestStatus('success', 'Пользователь успешно удален')
            showDeleteDialog.value = false
            deleteTargetId.value = null
        },
        onError: error => {
            setRequestStatus('danger', `Ошибка удаления: ${getErrorMessage(error)}`)
        },
    })

    const sendData = () => {
        submitted.value = true

        if (!customerState.phone || !customerState.email || !customerState.name || !customerState.role) {
            return
        }

        if (!isEdit.value && !customerState.password.trim()) {
            return
        }

        const payload = buildPayload()

        if (isEdit.value) {
            setRequestStatus('warn', 'Обновление пользователя...')
            updateCustomer({
                user_id: customerState.id,
                ...payload,
            })
            return
        }

        setRequestStatus('warn', 'Добавление пользователя...')
        createCustomer(payload)
    }

    const confirmDelete = item => {
        deleteTargetId.value = item.id
        showDeleteDialog.value = true
    }

    const handleDeleteDialog = () => {
        if (!deleteTargetId.value) {
            return
        }

        setRequestStatus('warn', 'Удаление пользователя...')
        deleteCustomer(deleteTargetId.value)
    }

    const handleSearch = debounce(event => {
        filters.value.global.value = event.target.value
    }, 300)

    return {
        customersList,
        isLoading,
        filters,
        roleOptions,
        expandedRows,
        showDetailDialog,
        showDeleteDialog,
        isEdit,
        submitted,
        customerState,
        deleteTargetId,
        requestStatus,
        isCreating,
        isUpdating,
        isDeleting,
        openNew,
        hideDialogs,
        editCustomer,
        sendData,
        confirmDelete,
        handleDeleteDialog,
        handleSearch,
        formatRoleLabel,
    }
})
