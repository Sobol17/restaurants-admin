<script setup>
import IconDelete from '@/components/icons/IconDelete.vue'
import ModalBottom from '@/components/ModalBottom.vue'
import AppSwitch from '@/components/ui/AppSwitch.vue'
import { useMenuStore } from '@/stores/client/menu'
import { useNavigationStore } from '@/stores/client/navigation'
import { getImagePath } from '@/utils/getImagePath'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const navStore = useNavigationStore()
const { changeTitle, changeBackLinkVisible } = navStore

const menuStore = useMenuStore()
const {
  categories,
  dish,
  isDishLoading,
  isDishSaving,
  isDishDeleting,
  dishLoadError,
  dishSaveError,
  dishDeleteError,
} = storeToRefs(menuStore)
const {
  loadDishById,
  createDish,
  saveDish,
  deleteDish,
  loadCategories,
  clearDish,
} = menuStore

const categoryModalRef = ref(null)
const fileInputRef = ref(null)

const itemId = computed(() => route.params.itemId)
const isEdit = computed(() => route.name === 'client-menu-item')

const form = ref({
  title: '',
  price: '',
  categoryId: '',
  description: '',
  isActive: true,
  images: [],
})

const pendingCategoryId = ref('')
const pendingFiles = ref([])

const normalizedPrice = value => {
  if (!value) {
    return ''
  }
  return String(value).replace(/[^\d.,]/g, '')
}

const normalizeCategoryId = value => {
  return Array.isArray(value) ? value[0] : value
}

const resetPendingFiles = () => {
  pendingFiles.value.forEach(item => {
    if (item?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(item.url)
    }
  })
  pendingFiles.value = []
}

const initForm = () => {
  resetPendingFiles()
  form.value = {
    title: '',
    price: '',
    categoryId:
      normalizeCategoryId(route.query.categoryId) ??
      categories.value[0]?.id ??
      '',
    description: '',
    isActive: true,
    images: [],
  }
  pendingCategoryId.value = form.value.categoryId
}

const applyDish = payload => {
  resetPendingFiles()
  form.value = {
    title: payload?.title ?? '',
    price: normalizedPrice(payload?.price ?? ''),
    categoryId: payload?.categoryId ?? categories.value[0]?.id ?? '',
    description: payload?.description ?? '',
    isActive: payload?.isActive ?? true,
    images: Array.isArray(payload?.images) ? [...payload.images] : [],
  }
  pendingCategoryId.value = form.value.categoryId
}

watchEffect(() => {
  changeTitle(isEdit.value ? 'Редактировать блюдо' : 'Добавить блюдо')
  changeBackLinkVisible(true)
})

watch(
  () => itemId.value,
  value => {
    if (isEdit.value && value) {
      loadDishById(value)
      return
    }
    clearDish()
    initForm()
  },
  { immediate: true },
)

watch(
  () => dish.value,
  value => {
    if (isEdit.value && value) {
      applyDish(value)
    }
  },
)

watch(
  () => categories.value,
  value => {
    if (!isEdit.value && !form.value.categoryId && value.length) {
      form.value.categoryId = value[0].id
      pendingCategoryId.value = form.value.categoryId
    }
  },
  { deep: true },
)

onMounted(() => {
  loadCategories({ skipLoading: true })
})

const visiblePhotos = computed(() => {
  return form.value.images.slice(0, 2)
})

const placeholderCount = computed(() => {
  return Math.max(0, 2 - visiblePhotos.value.length)
})

const addPhoto = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFiles = event => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    pendingFiles.value.push({ file, url })
    form.value.images.push(url)
  })
  event.target.value = ''
}

const removePhoto = index => {
  const [removed] = form.value.images.splice(index, 1)
  const pendingIndex = pendingFiles.value.findIndex(
    item => item.url === removed,
  )
  if (pendingIndex !== -1) {
    const pending = pendingFiles.value[pendingIndex]
    if (pending?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(pending.url)
    }
    pendingFiles.value.splice(pendingIndex, 1)
  }
}

const validationError = ref('')

const validate = () => {
  if (!form.value.title.trim()) {
    validationError.value = 'Укажите название блюда'
    return false
  }
  if (!form.value.price.trim()) {
    validationError.value = 'Укажите цену'
    return false
  }
  if (!form.value.categoryId) {
    validationError.value = 'Выберите категорию'
    return false
  }
  validationError.value = ''
  return true
}

const buildPayload = () => ({
  title: form.value.title,
  price: form.value.price,
  categoryId: form.value.categoryId,
  description: form.value.description,
  isActive: form.value.isActive,
})

const handleSave = async () => {
  if (isDishSaving.value || isDishDeleting.value || isDishLoading.value) {
    return
  }
  if (!validate()) {
    return
  }

  const payload = buildPayload()
  const files = pendingFiles.value.map(item => item.file)

  if (isEdit.value) {
    const saved = await saveDish({ id: itemId.value, ...payload }, files)
    if (saved) {
      resetPendingFiles()
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Блюдо успешно обновлено',
        life: 3000,
      })
      router.replace({ name: 'client-menu' })
    }
    return
  }

  const newId = await createDish(payload, files)
  if (newId) {
    resetPendingFiles()
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Блюдо успешно добавлено',
      life: 3000,
    })
    router.replace({ name: 'client-menu' })
  }
}

const handleSaveAndContinue = async () => {
  if (isDishSaving.value || isDishDeleting.value || isDishLoading.value) {
    return
  }
  if (!validate()) {
    return
  }

  const payload = buildPayload()
  const files = pendingFiles.value.map(item => item.file)

  const newId = await createDish(payload, files)
  if (newId) {
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Блюдо добавлено',
      life: 2000,
    })
    initForm()
  }
}

const handleDelete = async () => {
  if (!isEdit.value || isDishDeleting.value || isDishSaving.value) {
    return
  }
  const removed = await deleteDish(itemId.value)
  if (removed) {
    router.back()
  }
}

const categoryName = computed(() => {
  const current = categories.value.find(
    entry => entry.id === form.value.categoryId,
  )
  return current?.name ?? 'Категория'
})

const openCategoryModal = () => {
  pendingCategoryId.value = form.value.categoryId
  categoryModalRef.value?.openModal()
}

const applyCategory = () => {
  form.value.categoryId = pendingCategoryId.value
  categoryModalRef.value?.closeModal()
}

const errorMessage = computed(
  () => dishLoadError.value || dishSaveError.value || dishDeleteError.value,
)

onBeforeUnmount(() => {
  resetPendingFiles()
})
</script>

<template>
  <main class="menu-dish-detail">
    <div
      v-if="isDishLoading"
      class="menu-dish-detail__loader"
      role="status"
      aria-live="polite"
    >
      <span class="menu-dish-detail__spinner" aria-label="Загрузка"></span>
    </div>
    <template v-else>
      <p v-if="validationError" class="menu-dish-detail__error" role="alert">
        {{ validationError }}
      </p>
      <p v-else-if="errorMessage" class="menu-dish-detail__error" role="alert">
        {{ errorMessage }}
      </p>
      <section class="menu-dish-detail__section">
        <div class="menu-dish-detail__title">Фотография блюда</div>
        <div class="menu-dish-detail__photos">
          <button
            type="button"
            class="menu-dish-detail__photo menu-dish-detail__photo--add"
            @click="addPhoto"
          >
            <span class="menu-dish-detail__photo-icon"></span>
            <span class="menu-dish-detail__photo-text">Добавить фото</span>
          </button>
          <div
            v-for="(photo, index) in visiblePhotos"
            :key="`${photo}-${index}`"
            class="menu-dish-detail__photo menu-dish-detail__photo--filled"
          >
            <img :src="getImagePath(photo)" alt="Фото блюда" />
            <button
              v-if="isEdit"
              type="button"
              class="menu-dish-detail__photo-delete"
              @click="removePhoto(index)"
            >
              <IconDelete />
            </button>
          </div>
          <div
            v-for="slot in placeholderCount"
            :key="`placeholder-${slot}`"
            class="menu-dish-detail__photo menu-dish-detail__photo--placeholder"
          ></div>
        </div>
      </section>

      <section class="menu-dish-detail__section">
        <div class="menu-dish-detail__title">Информация</div>
        <div class="menu-dish-detail__fields">
          <input
            v-model.trim="form.title"
            type="text"
            class="menu-dish-detail__input"
            placeholder="Напишите название блюда"
          />
          <div class="menu-dish-detail__price">
            <input
              v-model.trim="form.price"
              type="text"
              class="menu-dish-detail__input menu-dish-detail__input--price"
              placeholder="Цена"
            />
            <span class="menu-dish-detail__price-symbol">₽</span>
          </div>
          <button
            type="button"
            class="menu-dish-detail__select"
            @click="openCategoryModal"
          >
            <span>{{ categoryName }}</span>
            <span class="menu-dish-detail__select-arrow"></span>
          </button>
          <textarea
            v-model.trim="form.description"
            class="menu-dish-detail__input menu-dish-detail__textarea"
            placeholder="Описание"
            rows="3"
          ></textarea>
        </div>
      </section>

      <div class="menu-dish-detail__toggle">
        <div class="menu-dish-detail__toggle-label">В продаже</div>
        <AppSwitch v-model="form.isActive" />
      </div>

      <div
        class="menu-dish-detail__actions"
        :class="{ 'menu-dish-detail__actions--single': !isEdit }"
      >
        <button
          v-if="isEdit"
          type="button"
          class="menu-dish-detail__btn menu-dish-detail__btn--muted"
          :disabled="isDishDeleting || isDishSaving"
          @click="handleDelete"
        >
          Удалить блюдо
        </button>
        <button
          type="button"
          class="menu-dish-detail__btn menu-dish-detail__btn--accent"
          :disabled="isDishDeleting || isDishSaving"
          @click="handleSave"
        >
          {{ isEdit ? 'Сохранить' : 'Добавить блюдо' }}
        </button>
        <button
          v-if="!isEdit"
          type="button"
          class="menu-dish-detail__btn menu-dish-detail__btn--muted"
          :disabled="isDishSaving"
          @click="handleSaveAndContinue"
        >
          Сохранить и продолжить
        </button>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="menu-dish-detail__file"
        @change="handleFiles"
      />

      <ModalBottom ref="categoryModalRef">
        <div class="menu-dish-detail__modal">
          <div class="menu-dish-detail__modal-title">Ваши категории</div>
          <div class="menu-dish-detail__modal-list">
            <label
              v-for="category in categories"
              :key="category.id"
              class="menu-dish-detail__modal-item"
            >
              <input
                v-model="pendingCategoryId"
                type="radio"
                :value="category.id"
              />
              <span class="menu-dish-detail__modal-radio"></span>
              <span class="menu-dish-detail__modal-text">{{
                category.name
              }}</span>
            </label>
          </div>
          <button
            type="button"
            class="menu-dish-detail__modal-apply"
            @click="applyCategory"
          >
            Применить
          </button>
        </div>
      </ModalBottom>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/layout/colors' as *;

.menu-dish-detail {
  min-height: 100vh;
  padding: 16px 16px 180px;
  background-color: #ffffff;
  margin-top: 10px;
  border-radius: 12px 12px 0 0;
}

.menu-dish-detail__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.menu-dish-detail__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2c3029;
  animation: menu-dish-spin 0.8s linear infinite;
}

@keyframes menu-dish-spin {
  to {
    transform: rotate(360deg);
  }
}

.menu-dish-detail__section {
  margin-bottom: 16px;
}

.menu-dish-detail__error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.menu-dish-detail__title {
  font-size: 14px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 10px;
}

.menu-dish-detail__photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.menu-dish-detail__photo {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background-color: #f2f2f2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: $color-accent;
  border: 1px solid #ededed;
}

.menu-dish-detail__photo--add {
  border: 1px dashed $color-accent;
  background-color: #fff5ec;
  cursor: pointer;
}

.menu-dish-detail__photo--placeholder {
  background-color: #f2f2f2;
}

.menu-dish-detail__photo--filled img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-dish-detail__photo-icon {
  width: 28px;
  height: 20px;
  border-radius: 6px;
  background: $color-accent;
  position: relative;
}

.menu-dish-detail__photo-icon::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffffff;
}

.menu-dish-detail__photo-icon::after {
  content: '';
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 4px;
  height: 6px;
  border-radius: 4px 4px 0 0;
  background-color: #ffffff;
}

.menu-dish-detail__photo-text {
  font-size: 12px;
  font-weight: 600;
}

.menu-dish-detail__photo-delete {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 10px;
  border: none;
  background-color: #ffffff;
  color: $color-danger;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.menu-dish-detail__fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-dish-detail__input {
  width: 100%;
  border: none;
  border-radius: 14px;
  background-color: #f2f2f2;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
  outline: none;
}

.menu-dish-detail__input::placeholder {
  color: #b6b8b5;
  font-weight: 600;
}

.menu-dish-detail__price {
  position: relative;
}

.menu-dish-detail__input--price {
  padding-right: 36px;
}

.menu-dish-detail__price-symbol {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.menu-dish-detail__textarea {
  min-height: 84px;
  resize: none;
}

.menu-dish-detail__select {
  border: none;
  border-radius: 14px;
  background-color: #f2f2f2;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}

.menu-dish-detail__select-arrow {
  width: 16px;
  height: 16px;
  background-image:
    linear-gradient(45deg, transparent 50%, #2c2c2c 50%),
    linear-gradient(135deg, #2c2c2c 50%, transparent 50%);
  background-position:
    4px 6px,
    9px 6px;
  background-size:
    5px 5px,
    5px 5px;
  background-repeat: no-repeat;
}

.menu-dish-detail__file {
  display: none;
}

.menu-dish-detail__modal {
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.menu-dish-detail__modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #2c2c2c;
}

.menu-dish-detail__modal-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.menu-dish-detail__modal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.menu-dish-detail__modal-item input {
  display: none;
}

.menu-dish-detail__modal-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-accent;
}

.menu-dish-detail__modal-item
  input:checked
  + .menu-dish-detail__modal-radio::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $color-accent;
}

.menu-dish-detail__modal-apply {
  width: 100%;
  border: none;
  height: 48px;
  border-radius: 12px;
  background-color: $color-accent;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.menu-dish-detail__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 2px 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.menu-dish-detail__actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px 18px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0px -10px 24px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.menu-dish-detail__actions--single {
  grid-template-columns: 1fr;
}

.menu-dish-detail__btn {
  border: none;
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.menu-dish-detail__btn--muted {
  background-color: #e8ebe6;
  color: #2c2c2c;
}

.menu-dish-detail__btn--accent {
  background-color: $color-accent;
  color: #ffffff;
}

.menu-dish-detail__btn--accent:active {
  background-color: #f27f22;
}
</style>
