<script setup>
import { useCustomersStore } from '@/stores/customers'
import { storeToRefs } from 'pinia'
import { InputText } from 'primevue'

const store = useCustomersStore()

const {
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
} = storeToRefs(store)

const {
  openNew,
  hideDialogs,
  editCustomer,
  sendData,
  confirmDelete,
  handleDeleteDialog,
  handleSearch,
  formatRoleLabel,
} = store
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Chip
            v-if="requestStatus"
            :label="requestStatus.label"
            class="customers-view__status-chip"
            :class="`customers-view__status-chip--${requestStatus.severity}`"
          />
        </template>
        <template #end>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            severity="secondary"
            class="mr-2"
            @click="openNew"
          />
        </template>
      </Toolbar>
      <DataTable
        scrollable
        scrollHeight="65vh"
        v-model:expandedRows="expandedRows"
        :value="customersList"
        stripedRows
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 15, 25]"
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
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText @input="handleSearch" placeholder="Поиск" />
              </IconField>
            </div>
          </div>
        </template>

        <!-- <Column
          field="avatarUrl"
          header="Аватар"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Avatar
              v-if="slotProps.data.avatarUrl"
              :image="getImagePath(slotProps.data.avatarUrl)"
              shape="circle"
              style="width: 120px; height: 120px"
            />
            <span v-else>—</span>
          </template>
        </Column> -->
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
        <Column field="role" header="Роль" sortable style="min-width: 10rem">
          <template #body="slotProps">
            {{ formatRoleLabel(slotProps.data.role) }}
          </template>
        </Column>
        <Column
          field="loyaltyPoints"
          header="Баллы лояльности"
          sortable
          style="min-width: 14rem"
        ></Column>
        <Column :exportable="false" style="min-width: 10rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editCustomer(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="flex items-center justify-center">
            <div class="text-gray-500 text-lg py-8">
              Нет данных для отображения
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="showDetailDialog"
      :style="{ width: '560px' }"
      :header="
        isEdit ? 'Редактирование пользователя' : 'Добавление пользователя'
      "
      :modal="true"
    >
      <div class="flex flex-col gap-4">
        <div v-if="isEdit">
          <label for="customer-id" class="block font-bold mb-3">ID</label>
          <InputText
            id="customer-id"
            v-model="customerState.id"
            disabled
            fluid
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="customer-phone" class="block font-bold mb-3"
              >Телефон</label
            >
            <InputText
              id="customer-phone"
              v-model.trim="customerState.phone"
              required="true"
              :invalid="submitted && !customerState.phone"
              fluid
            />
            <small v-if="submitted && !customerState.phone" class="text-red-500"
              >Обязательное поле</small
            >
          </div>
          <div>
            <label for="customer-email" class="block font-bold mb-3"
              >Email</label
            >
            <InputText
              id="customer-email"
              v-model.trim="customerState.email"
              required="true"
              :invalid="submitted && !customerState.email"
              fluid
            />
            <small v-if="submitted && !customerState.email" class="text-red-500"
              >Обязательное поле</small
            >
          </div>
          <div>
            <label for="customer-name" class="block font-bold mb-3">Имя</label>
            <InputText
              id="customer-name"
              v-model.trim="customerState.name"
              required="true"
              :invalid="submitted && !customerState.name"
              fluid
            />
            <small v-if="submitted && !customerState.name" class="text-red-500"
              >Обязательное поле</small
            >
          </div>
          <div>
            <label for="customer-role" class="block font-bold mb-3">Роль</label>
            <select
              id="customer-role"
              v-model="customerState.role"
              class="w-full rounded-md border border-surface-300 px-3 py-2 bg-white"
              :class="{ 'border-red-500': submitted && !customerState.role }"
            >
              <option
                v-for="option in roleOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <small v-if="submitted && !customerState.role" class="text-red-500"
              >Обязательное поле</small
            >
          </div>
          <div class="md:col-span-2">
            <label for="customer-password" class="block font-bold mb-3">
              {{ isEdit ? 'Пароль' : 'Пароль *' }}
            </label>
            <InputText
              id="customer-password"
              v-model.trim="customerState.password"
              type="text"
              :invalid="submitted && !isEdit && !customerState.password"
              fluid
            />
            <small v-if="isEdit" class="text-gray-500"
              >Оставьте пустым, если пароль менять не нужно</small
            >
            <small
              v-else-if="submitted && !customerState.password"
              class="text-red-500"
              >Обязательное поле</small
            >
          </div>
          <!-- <div class="md:col-span-2">
            <label for="customer-avatar-url" class="block font-bold mb-3"
              >Avatar URL</label
            >
            <InputText
              id="customer-avatar-url"
              v-model.trim="customerState.avatarUrl"
              fluid
            />
          </div> -->
        </div>
      </div>

      <template #footer>
        <Button
          label="Отменить"
          icon="pi pi-times"
          text
          @click="hideDialogs"
          :loading="isUpdating || isCreating"
        />
        <Button
          label="Сохранить"
          icon="pi pi-check"
          @click="sendData"
          :loading="isUpdating || isCreating"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showDeleteDialog"
      :style="{ width: '450px' }"
      header="Подтверждение"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        Вы уверены, что хотите удалить запись {{ deleteTargetId }}?
      </div>
      <template #footer>
        <Button
          label="Нет"
          icon="pi pi-times"
          text
          @click="showDeleteDialog = false"
        />
        <Button
          label="Да"
          icon="pi pi-check"
          @click="handleDeleteDialog"
          :loading="isDeleting"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.customers-view__status-chip {
  border: 1px solid transparent;
}

.customers-view__status-chip--warn {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}

.customers-view__status-chip--success {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.customers-view__status-chip--danger {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}
</style>
