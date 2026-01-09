<script setup>
import {InputText} from 'primevue'
import {storeToRefs} from 'pinia'
import {getImagePath} from '@/utils/getImagePath'
import {useCouriersStore} from "@/stores/couriers";

const store = useCouriersStore()

const {
  couriersList,
  isLoading,
  filters,
  expandedRows,
} = storeToRefs(store)

const {
  handleSearch,
} = store

</script>

<template>
  <div>
    <div class="card">
      <DataTable
          scrollable
          scrollHeight="65vh"
          v-model:expandedRows="expandedRows"
          :value="couriersList"
          stripedRows
          dataKey="id"
          :paginator="true"
          :rows="7"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[7, 10, 25]"
          :currentPageReportTemplate="`{first} до {last} элементов`"
          :loading="isLoading"
          removableSort
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Курьеры</h4>
            <div class="flex gap-x-2">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search"/>
                </InputIcon>
                <InputText @input="handleSearch" placeholder="Поиск"/>
              </IconField>
            </div>
          </div>
        </template>

        <Column expander style="width: 5rem"/>
        <Column
            field="id"
            header="ID"
            sortable
            style="min-width: 8rem"
        ></Column>
        <Column
            field="currentLat"
            header="Текущая широта"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="currentLng"
            header="Текущая долгота"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="isAvailable"
            header="Доступность"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="payoutInfo"
            header="Платежная инф."
            sortable
            style="min-width: 10rem"
        ></Column>
        <template #expansion="slotProps">
          <div class="p-4">
            <div class="flex flex-col gap-6">
              <div>
                <h5>Прикрепленный пользователь</h5>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span class="font-semibold">ID:</span> {{ slotProps.data.user?.id ?? '—' }}</div>
                  <div><span class="font-semibold">Имя:</span> {{ slotProps.data.user?.name ?? '—' }}</div>
                  <div><span class="font-semibold">Телефон:</span> {{ slotProps.data.user?.phone ?? '—' }}</div>
                  <div><span class="font-semibold">Email:</span> {{ slotProps.data.user?.email ?? '—' }}</div>
                </div>
                <div class="mt-3">
                  <Image
                      v-if="slotProps.data.user?.avatarUrl"
                      :src="getImagePath(slotProps.data.user.avatarUrl)"
                      class="max-w-full"
                  />
                  <div v-else class="text-gray-500">Нет данных</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex items-center justify-center">
            <div class="text-gray-500 text-lg py-8">
              Нет данных для отображения
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
