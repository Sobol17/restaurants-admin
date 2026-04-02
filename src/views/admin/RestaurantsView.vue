<script setup>

import {AutoComplete, InputText, Textarea} from 'primevue'
import {storeToRefs} from 'pinia'
import {useRestaurantsStore} from '@/stores/restaurants'
import {getImagePath} from '@/utils/getImagePath'

const restaurantsStore = useRestaurantsStore()
const {
  restaurantsList,
  isLoading,
  filters,
  expandedRows,
  showDetailDialog,
  showDeleteDialog,
  isEdit,
  submitted,
  restaurantState,
  deleteTargetId,
  workingHoursDayOptions,
  workingHoursDays,
  isCreating,
  isUpdating,
  isUpdatingImages,
  isDeleting,
  logoPreviewSrc,
  imagePreviewSrc,
  isOwnersLoading,
  ownerSuggestions,
  ownerSearchValue,
} = storeToRefs(restaurantsStore)

const {
  openNew,
  hideDialogs,
  editRestaurant,
  addWorkingInterval,
  removeWorkingInterval,
  sendData,
  sendImages,
  onLogoUpload,
  onLogoClear,
  onImageUpload,
  onImageClear,
  confirmDelete,
  handleDeleteDialog,
  handleSearch,
  searchOwners,
  handleOwnerSelect,
  handleOwnerChange,
  handleOwnerClear,
  formatBoolean,
  formatCuisines,
  getWorkingHoursList,
} = restaurantsStore

</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
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
          :value="restaurantsList"
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
            <h4 class="m-0">Рестораны</h4>
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
            field="ownerId"
            header="ID владельца"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="name"
            header="Название"
            sortable
            style="min-width: 16rem"
        ></Column>
        <Column
            field="address"
            header="Адрес"
            sortable
            style="min-width: 20rem"
        ></Column>
        <Column
            field="minOrderSum"
            header="Мин. сумма"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="freeDeliveryFrom"
            header="Бесплатная доставка от"
            sortable
            style="min-width: 14rem"
        ></Column>
        <Column
            field="rating"
            header="Рейтинг"
            sortable
            style="min-width: 8rem"
        ></Column>
        <Column
            field="loyaltyIsEnabled"
            header="Лояльность"
            sortable
            style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ formatBoolean(slotProps.data.loyaltyIsEnabled) }}
          </template>
        </Column>
        <Column
            field="cardIsEnabled"
            header="Оплата картой"
            sortable
            style="min-width: 12rem"
        >
          <template #body="slotProps">
            {{ formatBoolean(slotProps.data.cardIsEnabled) }}
          </template>
        </Column>
        <Column
            field="promoIsEnabled"
            header="Промо"
            sortable
            style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ formatBoolean(slotProps.data.promoIsEnabled) }}
          </template>
        </Column>
        <Column
            field="loyaltyPercent"
            header="Лояльность %"
            sortable
            style="min-width: 12rem"
        ></Column>
        <Column
            field="isPaused"
            header="Пауза"
            sortable
            style="min-width: 8rem"
        >
          <template #body="slotProps">
            {{ formatBoolean(slotProps.data.isPaused) }}
          </template>
        </Column>
        <Column
            field="isBanned"
            header="Бан"
            sortable
            style="min-width: 8rem"
        >
          <template #body="slotProps">
            {{ formatBoolean(slotProps.data.isBanned) }}
          </template>
        </Column>
        <Column
            field="latitude"
            header="Широта"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="longitude"
            header="Долгота"
            sortable
            style="min-width: 10rem"
        ></Column>
        <Column
            field="payoutInfo"
            header="Платежная информация"
            sortable
            style="min-width: 18rem"
        ></Column>
        <Column :exportable="false" style="min-width: 10rem">
          <template #body="slotProps">
            <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editRestaurant(slotProps.data)"
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
        <template #expansion="slotProps">
          <div class="p-4">
            <div class="flex flex-col gap-6">
              <div>
                <h5>Владелец</h5>
                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><span class="font-semibold">ID:</span> {{ slotProps.data.owner?.id ?? '—' }}</div>
                  <div><span class="font-semibold">Имя:</span> {{ slotProps.data.owner?.name ?? '—' }}</div>
                  <div><span class="font-semibold">Телефон:</span> {{ slotProps.data.owner?.phone ?? '—' }}</div>
                  <div><span class="font-semibold">Email:</span> {{ slotProps.data.owner?.email ?? '—' }}</div>
                  <div><span class="font-semibold">Роль:</span> {{ slotProps.data.owner?.role ?? '—' }}</div>
                </div>
                <div class="mt-3">
                  <Image
                      v-if="slotProps.data.owner?.avatarUrl"
                      :src="getImagePath(slotProps.data.owner.avatarUrl)"
                      class="max-w-full"
                  />
                  <div v-else class="text-gray-500">Нет данных</div>
                </div>
              </div>
              <div>
                <h5>Логотип</h5>
                <div class="mt-3">
                  <Image
                      v-if="slotProps.data.logoUrl"
                      :src="getImagePath(slotProps.data.logoUrl)"
                      class="max-w-full"
                  />
                  <div v-else class="text-gray-500">Нет данных</div>
                </div>
              </div>
              <div>
                <h5>Изображение</h5>
                <div class="mt-3">
                  <Image
                      v-if="slotProps.data.imageUrl"
                      :src="getImagePath(slotProps.data.imageUrl)"
                      class="max-w-full"
                  />
                  <div v-else class="text-gray-500">Нет данных</div>
                </div>
              </div>
              <div>
                <h5>Кухни</h5>
                <div class="mt-2 text-sm">
                  {{ formatCuisines(slotProps.data.cuisines) }}
                </div>
              </div>
              <div>
                <h5>Часы работы</h5>
                <div v-if="getWorkingHoursList(slotProps.data.workingHours).length" class="mt-2 grid gap-2 text-sm">
                  <div
                      v-for="(item, index) in getWorkingHoursList(slotProps.data.workingHours)"
                      :key="`${slotProps.data.id}-hours-${index}`"
                  >
                    <span class="font-semibold">{{ item.label }}:</span> {{ item.value }}
                  </div>
                </div>
                <div v-else class="text-gray-500">Нет данных</div>
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

    <Dialog
        v-model:visible="showDetailDialog"
        :style="{ width: '720px' }"
        header="Ресторан"
        :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div v-if="isEdit">
          <label for="restaurant-id" class="block font-bold mb-3">ID</label>
          <InputText
              id="restaurant-id"
              v-model.trim="restaurantState.id"
              required="true"
              autofocus
              disabled
              fluid
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="owner-id" class="block font-bold mb-3">ID владельца</label>
            <AutoComplete
                id="owner-id"
                v-model="ownerSearchValue"
                :suggestions="ownerSuggestions"
                optionLabel="displayLabel"
                dropdown
                forceSelection
                fluid
                :loading="isOwnersLoading"
                placeholder="Начните вводить ID, email или телефон"
                required="true"
                :invalid="submitted && !restaurantState.ownerId"
                @complete="searchOwners"
                @option-select="handleOwnerSelect"
                @change="handleOwnerChange"
                @clear="handleOwnerClear"
            />
            <small v-if="submitted && !restaurantState.ownerId" class="text-red-500">Обязательное поле</small>
          </div>
          <div>
            <label for="restaurant-name" class="block font-bold mb-3">Название</label>
            <InputText
                id="restaurant-name"
                v-model.trim="restaurantState.name"
                required="true"
                :invalid="submitted && !restaurantState.name"
                fluid
            />
            <small v-if="submitted && !restaurantState.name" class="text-red-500">Обязательное поле</small>
          </div>
          <div class="md:col-span-2">
            <label for="restaurant-address" class="block font-bold mb-3">Адрес</label>
            <InputText
                id="restaurant-address"
                v-model.trim="restaurantState.address"
                required="true"
                :invalid="submitted && !restaurantState.address"
                fluid
            />
            <small v-if="submitted && !restaurantState.address" class="text-red-500">Обязательное поле</small>
          </div>
          <div>
            <label for="min-order" class="block font-bold mb-3">Мин. сумма заказа</label>
            <InputText id="min-order" v-model.trim="restaurantState.minOrderSum" type="number" fluid />
          </div>
          <div>
            <label for="free-delivery" class="block font-bold mb-3">Бесплатная доставка от</label>
            <InputText id="free-delivery" v-model.trim="restaurantState.freeDeliveryFrom" type="number" fluid />
          </div>
          <div>
            <label for="loyalty-percent" class="block font-bold mb-3">Процент лояльности</label>
            <InputText id="loyalty-percent" v-model.trim="restaurantState.loyaltyPercent" type="number" fluid />
          </div>
          <div>
            <label for="latitude" class="block font-bold mb-3">Широта</label>
            <InputText id="latitude" v-model.trim="restaurantState.latitude" type="number" fluid />
          </div>
          <div>
            <label for="longitude" class="block font-bold mb-3">Долгота</label>
            <InputText id="longitude" v-model.trim="restaurantState.longitude" type="number" fluid />
          </div>
        </div>

        <div>
          <div class="block font-bold mb-3">Флаги</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <Checkbox v-model="restaurantState.loyaltyIsEnabled" inputId="loyalty-enabled" binary />
              <label for="loyalty-enabled">Лояльность включена</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="restaurantState.cardIsEnabled" inputId="card-enabled" binary />
              <label for="card-enabled">Оплата картой включена</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="restaurantState.promoIsEnabled" inputId="promo-enabled" binary />
              <label for="promo-enabled">Промо включено</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="restaurantState.isPaused" inputId="is-paused" binary />
              <label for="is-paused">Пауза</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="restaurantState.isBanned" inputId="is-banned" binary />
              <label for="is-banned">Бан</label>
            </div>
          </div>
        </div>

        <div>
          <label for="payout-info" class="block font-bold mb-3">Платежная информация</label>
          <Textarea id="payout-info" v-model.trim="restaurantState.payoutInfo" rows="3" fluid />
        </div>

        <div>
          <label for="cuisines" class="block font-bold mb-3">Кухни</label>
          <Textarea
              id="cuisines"
              v-model.trim="restaurantState.cuisinesInput"
              rows="2"
              placeholder="Итальянская, Японская"
              fluid
          />
        </div>

        <div v-if="isEdit">
          <div class="block font-bold mb-3">Фотографии</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="font-semibold mb-2">Логотип</div>
              <FileUpload
                  mode="basic"
                  @select="onLogoUpload"
                  @clear="onLogoClear"
                  customUpload
                  auto
                  severity="secondary"
                  class="p-button-outlined"
                  chooseLabel="Выбрать"
              />
              <Image v-if="logoPreviewSrc" :src="logoPreviewSrc" class="mt-3 max-w-full" />
            </div>
            <div>
              <div class="font-semibold mb-2">Изображение</div>
              <FileUpload
                  mode="basic"
                  @select="onImageUpload"
                  @clear="onImageClear"
                  customUpload
                  auto
                  severity="secondary"
                  class="p-button-outlined"
                  chooseLabel="Выбрать"
              />
              <Image v-if="imagePreviewSrc" :src="imagePreviewSrc" class="mt-3 max-w-full" />
            </div>
          </div>
          <div class="mt-3">
            <Button
                label="Сохранить изображения"
                icon="pi pi-check"
                @click="sendImages"
                :loading="isUpdatingImages"
            />
          </div>
        </div>

        <div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="block font-bold">Часы работы</div>
            <div class="text-sm text-gray-500">Формат: 08:00-20:00</div>
          </div>
          <div class="flex flex-col gap-4">
            <div
                v-for="day in workingHoursDayOptions"
                :key="day.key"
                class="border border-surface-200 rounded-lg p-3"
            >
              <div class="flex items-center justify-between">
                <div class="font-semibold">{{ day.label }}</div>
                <Button
                    label="Добавить интервал"
                    icon="pi pi-plus"
                    text
                    @click="addWorkingInterval(day.key)"
                />
              </div>
              <div v-if="workingHoursDays[day.key].length" class="mt-3 flex flex-col gap-2">
                <div
                    v-for="(interval, index) in workingHoursDays[day.key]"
                    :key="`${day.key}-${index}`"
                    class="flex flex-wrap items-center gap-2"
                >
                  <InputText v-model="interval.start" type="time" class="w-28" />
                  <span class="text-gray-500">-</span>
                  <InputText v-model="interval.end" type="time" class="w-28" />
                  <Button
                      icon="pi pi-trash"
                      text
                      severity="danger"
                      @click="removeWorkingInterval(day.key, index)"
                  />
                </div>
              </div>
              <div v-else class="mt-2 text-sm text-gray-500">Нет интервалов</div>
            </div>
          </div>
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
        <i class="pi pi-exclamation-triangle !text-3xl"/>
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
