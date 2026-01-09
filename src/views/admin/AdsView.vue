<script setup>

import {debounce} from '@/utils/debounce'
import {FilterMatchMode} from '@primevue/core/api'
import {InputText, Textarea} from 'primevue'
import {useToast} from 'primevue/usetoast'
import {computed, reactive, ref} from 'vue'
import {useAdsApi} from '@/services/useAds'
import {getImagePath} from '@/utils/getImagePath'
import {usePhotoUtils} from '@/utils/usePhotoUtils'

const {getList, create, update, deleteElement} = useAdsApi()
const {data: adsData, isLoading} = getList()

const search = ref('')
const toast = useToast()
const dt = ref()

const showDeleteDialog = ref(false)
const showDetailDialog = ref(false)

const adsRefList = computed(() => {
  return adsData?.value || []
})

const isEdit = ref(false)

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
})

const adState = reactive({
  id: null,
  imageUrl: null,
  link: null,
  file: null,
  previewUrl: null,
})

const {imagePreviewSrc, onUpload, onClearUpload, resetPhotoState} = usePhotoUtils(
    adState,
    {getImagePath}
)

const {mutate: createNewAd, isPending: isLoadingCreate} = create({
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Рекламмный баннер успешно добавлен',
      life: 3000,
    })
    hideDialogs()
  },
  onError: error => {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: `Ошибка при отправке на сервер ${error}`,
      life: 3000,
    })
  },
})

const {mutate: updateAd, isPending: isUpdatingAd} = update({
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Рекламмный баннер успешно обновлен',
      life: 3000,
    })
    hideDialogs()
  },
  onError: error => {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: `Ошибка при отправке на сервер ${error}`,
      life: 3000,
    })
  },
})

const sendData = () => {
  submitted.value = true
  if (!adState.link) {
    return
  }
  if (!adState.file && !adState.imageUrl) {
    return
  }

  const formData = new FormData()
  if (adState.id) {
    formData.append('ad_id', adState.id)
  }
  if (adState.file) {
    formData.append('image', adState.file)
  }
  formData.append('link', adState.link)

  if (isEdit.value) {
    updateAd(formData)
    return
  }

  createNewAd(formData)
}

const submitted = ref(false)

const resetAdState = () => {
  adState.id = null
  adState.imageUrl = null
  adState.link = null
  resetPhotoState()
}

const openNew = () => {
  resetAdState()
  submitted.value = false
  showDetailDialog.value = true
  isEdit.value = false
}

const hideDialogs = () => {
  showDetailDialog.value = false
  showDeleteDialog.value = false
  isEdit.value = false
  submitted.value = false
  resetAdState()
}

const editAd = item => {
  isEdit.value = true
  resetAdState()
  adState.id = item.id
  adState.imageUrl = item.imageUrl
  adState.link = item.link
  showDetailDialog.value = true
}

const {mutate: deleteAd, isPending: isDeletingAd} = deleteElement({
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Рекламмный баннер успешно удален',
      life: 3000,
    })
    hideDialogs()
  },
  onError: error => {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: `Ошибка при удалении ${error}`,
      life: 3000,
    })
  },
})

const handleDeleteDialog = () => {
  deleteAd(adState.id)
}

const confirmDelete = (item) => {
  adState.id = item.id
  showDeleteDialog.value = true
}

const expandedRows = ref([])

const handleSearch = debounce(event => {
  search.value = event.target.value
}, 300)

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
          ref="dt"
          :value="adsRefList"
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
            <h4 class="m-0">Рекламные баннеры (ads)</h4>
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
            style="min-width: 12rem"
        ></Column>
        <Column
            field="imageUrl"
            header="Изображение (ссылка)"
            sortable
            style="min-width: 8rem"
        ></Column>
        <Column
            field="link"
            header="Ссылка"
            sortable
            style="min-width: 8rem"
        >
          <template #body="slotProps">
            <a class="hover:underline" :href="slotProps.data.link" target="_blank">{{ slotProps.data.link }}</a>
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editAd(slotProps.data)"
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
            <h5>Изображение</h5>
            <div class="mt-4">
              <Image :src="getImagePath(slotProps.data.imageUrl)" class="max-w-full"/>
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
        :style="{ width: '450px' }"
        header="FAQ"
        :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div v-if="isEdit">
          <label for="name" class="block font-bold mb-3">ID</label>
          <InputText
              id="name"
              v-model.trim="adState.id"
              required="true"
              autofocus
              :invalid="submitted && !adState.id"
              fluid
              disabled
          />
        </div>
        <div>
          <div class="block font-bold mb-3">Изображение</div>
          <FileUpload
              mode="basic"
              @select="onUpload"
              @clear="onClearUpload"
              customUpload
              auto
              severity="secondary"
              class="p-button-outlined"
              chooseLabel="Выбрать"
          />
          <Image v-if="imagePreviewSrc" :src="imagePreviewSrc" class="mt-4 max-w-full"/>
          <small v-if="submitted && !adState.file && !adState.imageUrl" class="text-red-500"
          >Обязательное поле</small
          >
        </div>
        <div>
          <label for="name" class="block font-bold mb-3">Ссылка</label>
          <Textarea
              id="name"
              v-model.trim="adState.link"
              required="true"
              autofocus
              :invalid="submitted && !adState.link"
              fluid
          />
          <small v-if="submitted && !adState.link" class="text-red-500"
          >Обязательное поле</small
          >
        </div>
      </div>

      <template #footer>
        <Button
            label="Отменить"
            icon="pi pi-times"
            text
            @click="hideDialogs"
            :loading="isUpdatingAd || isLoadingCreate"
        />
        <Button
            label="Сохранить"
            icon="pi pi-check"
            @click="sendData"
            :loading="isUpdatingAd || isLoadingCreate"
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
        Вы уверены, что хотите удалить запись {{ adState.id }}?
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
            :loading="isDeletingAd"
        />
      </template>
    </Dialog>
  </div>
</template>
