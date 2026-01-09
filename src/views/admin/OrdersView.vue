<script setup>
import {DatePicker, InputText} from 'primevue'
import {storeToRefs} from 'pinia'
import {useOrdersStore} from '@/stores/orders'

const store = useOrdersStore()

const {
  ordersList,
  isLoading,
  filters,
  expandedRows,
  filterState,
} = storeToRefs(store)

const {
  applyFilters,
  resetFilters,
  handleSearch,
} = store
</script>

<template>
  <div>
    <div class="card">
      <div class="mb-4">
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">Заказы</h4>
          <div class="flex gap-x-2">
            <IconField>
              <InputIcon>
                <i class="pi pi-search"/>
              </InputIcon>
              <InputText @input="handleSearch" placeholder="Поиск"/>
            </IconField>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div class="flex flex-col gap-2">
            <label for="order-id">ID</label>
            <InputText id="order-id" v-model.trim="filterState.id" type="number" placeholder="ID"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="customer-id">ID клиента</label>
            <InputText id="customer-id" v-model.trim="filterState.customerId" type="number" placeholder="ID клиента"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="restaurant-id">ID ресторана</label>
            <InputText id="restaurant-id" v-model.trim="filterState.restaurantId" type="number" placeholder="ID ресторана"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="courier-id">ID курьера</label>
            <InputText id="courier-id" v-model.trim="filterState.courierId" type="number" placeholder="ID курьера"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="phone">Телефон</label>
            <InputText id="phone" v-model.trim="filterState.phone" placeholder="Телефон"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="status">Статус</label>
            <InputText id="status" v-model.trim="filterState.status" placeholder="Статус"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="start-date">Дата начала</label>
            <DatePicker
                id="start-date"
                v-model="filterState.startDate"
                dateFormat="yy-mm-dd"
                placeholder="ГГГГ-ММ-ДД"
                showIcon
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="end-date">Дата окончания</label>
            <DatePicker
                id="end-date"
                v-model="filterState.endDate"
                dateFormat="yy-mm-dd"
                placeholder="ГГГГ-ММ-ДД"
                showIcon
            />
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <Button label="Применить" icon="pi pi-filter" @click="applyFilters"/>
          <Button label="Сбросить" icon="pi pi-times" severity="secondary" @click="resetFilters"/>
        </div>
      </div>

      <DataTable
          scrollable
          scrollHeight="65vh"
          v-model:expandedRows="expandedRows"
          :value="ordersList"
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
        <Column expander style="width: 5rem"/>
        <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
        <Column field="status" header="Статус" sortable style="min-width: 8rem"></Column>
        <Column field="phone" header="Телефон" sortable style="min-width: 10rem"></Column>
        <Column field="customerId" header="Customer ID" sortable style="min-width: 8rem"></Column>
        <Column field="restaurantId" header="Restaurant ID" sortable style="min-width: 8rem"></Column>
        <Column field="courierId" header="Courier ID" sortable style="min-width: 8rem"></Column>
        <Column field="totalCost" header="Итого" sortable style="min-width: 8rem"></Column>
        <Column field="deliveryAddress" header="Адрес" sortable style="min-width: 12rem"></Column>
        <Column field="finishedAt" header="Завершен" sortable style="min-width: 8rem"></Column>

        <template #expansion="slotProps">
          <div class="p-4">
            <div class="flex flex-col gap-6">
              <div>
                <h5>Детали заказа</h5>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span class="font-semibold">Комментарий:</span> {{ slotProps.data.comment || '—' }}</div>
                  <div><span class="font-semibold">Адрес доставки:</span> {{ slotProps.data.deliveryAddress || '—' }}</div>
                  <div><span class="font-semibold">Стоимость блюд:</span> {{ slotProps.data.foodCost ?? '—' }}</div>
                  <div><span class="font-semibold">Стоимость доставки:</span> {{ slotProps.data.deliveryCost ?? '—' }}</div>
                  <div><span class="font-semibold">Итого:</span> {{ slotProps.data.totalCost ?? '—' }}</div>
                  <div><span class="font-semibold">Баллы лояльности:</span> {{ slotProps.data.useLoyaltyPoints ?? '—' }}</div>
                  <div>
                    <span class="font-semibold">Координаты:</span>
                    {{ slotProps.data.latitude ?? '—' }}, {{ slotProps.data.longitude ?? '—' }}
                  </div>
                  <div><span class="font-semibold">Время готовки (мин):</span> {{ slotProps.data.cookTimeMinutes ?? '—' }}</div>
                  <div><span class="font-semibold">Завершен:</span> {{ slotProps.data.finishedAt ?? '—' }}</div>
                </div>
              </div>

              <div>
                <h5>Позиции заказа</h5>
                <DataTable
                    v-if="slotProps.data.items && slotProps.data.items.length"
                    :value="slotProps.data.items"
                    stripedRows
                    dataKey="id"
                >
                  <Column field="id" header="ID" style="min-width: 6rem"></Column>
                  <Column field="quantity" header="Кол-во" style="min-width: 6rem"></Column>
                  <Column header="Блюдо" style="min-width: 10rem">
                    <template #body="itemProps">
                      {{ itemProps.data.dish?.name ?? '—' }}
                    </template>
                  </Column>
                  <Column header="Цена" style="min-width: 6rem">
                    <template #body="itemProps">
                      {{ itemProps.data.dish?.price ?? '—' }}
                    </template>
                  </Column>
                  <Column header="Категория" style="min-width: 10rem">
                    <template #body="itemProps">
                      {{ itemProps.data.dish?.category?.name ?? '—' }}
                    </template>
                  </Column>
                  <Column header="Пауза" style="min-width: 6rem">
                    <template #body="itemProps">
                      {{
                        itemProps.data.dish
                            ? (itemProps.data.dish.isPaused ? 'Да' : 'Нет')
                            : '—'
                      }}
                    </template>
                  </Column>
                </DataTable>
                <div v-else class="text-gray-500 mt-2">Нет позиций</div>
              </div>

              <div>
                <h5>Отзыв</h5>
                <div v-if="slotProps.data.review" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span class="font-semibold">Рейтинг:</span> {{ slotProps.data.review.rating ?? '—' }}</div>
                  <div><span class="font-semibold">Комментарий:</span> {{ slotProps.data.review.comment || '—' }}</div>
                </div>
                <div v-else class="text-gray-500">Нет отзыва</div>
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
