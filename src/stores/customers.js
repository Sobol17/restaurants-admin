import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {FilterMatchMode} from '@primevue/core/api'
import {debounce} from '@/utils/debounce'
import {useCustomersApi} from "@/services/useCustomers";

export const useCustomersStore = defineStore('customers', () => {
    const {getList} = useCustomersApi()
    const {data: customersData, isLoading} = getList()

    const expandedRows = ref([])

    const filters = ref({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    const customersList = computed(() => {
        return customersData?.value || []
    })

    const handleSearch = debounce(event => {
        filters.value.global.value = event.target.value
    }, 300)

    return {
        customersList: customersList,
        isLoading,
        filters,
        expandedRows,
        handleSearch,
    }
})
