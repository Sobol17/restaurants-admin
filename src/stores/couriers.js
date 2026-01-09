import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {FilterMatchMode} from '@primevue/core/api'
import {debounce} from '@/utils/debounce'
import {useCouriersApi} from "@/services/useCouriers";

export const useCouriersStore = defineStore('couriers', () => {
    const {getList} = useCouriersApi()
    const {data: couriersData, isLoading} = getList()

    const expandedRows = ref([])

    const filters = ref({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    const couriersList = computed(() => {
        return couriersData?.value || []
    })

    const handleSearch = debounce(event => {
        filters.value.global.value = event.target.value
    }, 300)

    return {
        couriersList: couriersList,
        isLoading,
        filters,
        expandedRows,
        handleSearch,
    }
})
