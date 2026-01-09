<script setup>

import {InputText} from 'primevue'
import {storeToRefs} from 'pinia'
import {getImagePath} from '@/utils/getImagePath'
import {useCustomersStore} from "@/stores/customers";

const store = useCustomersStore()

const {
  customersList,
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
          :value="customersList"
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
            <h4 class="m-0">Пользователи</h4>
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

        <Column
            field="avatarUrl"
            header="Аватар"
            sortable
            style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Avatar
                v-if="slotProps.avatarUrl"
                :image="getImagePath(slotProps.avatarUrl)"
                shape="circle"
                style="width: 120px; height: 120px"
            />
          </template>
        </Column>
        <Column
            field="id"
            header="ID"
            sortable
            style="min-width: 8rem"
        ></Column>
        <Column
            field="phone"
            header="Телефон"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="name"
            header="Имя"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="email"
            header="Email"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="role"
            header="Роль"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="loyaltyPoints"
            header="Баллы лояльности"
            sortable
            style="min-width: 14rem"
        ></Column>
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
