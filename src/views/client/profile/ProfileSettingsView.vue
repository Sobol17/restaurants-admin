<script setup>
import IconDelete from '@/components/icons/IconDelete.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import { useNavigationStore } from '@/stores/client/navigation'
import { useProfileStore } from '@/stores/client/profile'
import { getImagePath } from '@/utils/getImagePath'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const navStore = useNavigationStore()
const { changeTitle, changeBackLinkVisible } = navStore
const toast = useToast()
const router = useRouter()

changeTitle('Настройки ресторана')
changeBackLinkVisible(true)

const profileStore = useProfileStore()
const { profile, selectedPayments, isLoading, isSaving, loadError, saveError } =
  storeToRefs(profileStore)

const restaurantName = ref('')
const restaurantAddress = ref('')
const restaurantContact = ref('')
const restaurantDescription = ref('')
const pauseText = ref('')

const logoInputRef = ref(null)
const logoFile = ref(null)
const logoPreviewUrl = ref(null)

const logoUrl = computed(
  () =>
    logoPreviewUrl.value ||
    profile.value?.logo_url ||
    profile.value?.image_url ||
    '',
)
const logoFallbackText = computed(() => {
  const name = restaurantName.value?.trim()
  return name ? name.slice(0, 10).toUpperCase() : 'LOGO'
})
const errorMessage = computed(() => loadError.value || saveError.value)

const applyProfileData = data => {
  restaurantName.value = data?.name ?? ''
  restaurantAddress.value = data?.address ?? ''
  restaurantContact.value = data?.payout_info ?? ''
  restaurantDescription.value = data?.description ?? ''
  pauseText.value = data?.pause_text ?? ''
}

const loadProfile = async () => {
  const data = await profileStore.loadProfile({
    errorMessage: 'Failed to load restaurant settings.',
  })
  if (data) {
    applyProfileData(data)
  }
}

const buildSettingsPayload = () => {
  const payload = {
    name: restaurantName.value?.trim() ?? '',
    min_order_sum: profile.value?.min_order_sum ?? 0,
    free_delivery_from: profile.value?.free_delivery_from ?? 0,
    working_hours: profile.value?.working_hours ?? {},
    is_paused: profile.value?.is_paused ?? false,
    latitude: profile.value?.latitude ?? 0,
    longitude: profile.value?.longitude ?? 0,
    payout_info: profile.value?.payout_info ?? '',
    cuisines: profile.value?.cuisines ?? [],
    card_is_enabled: selectedPayments.value.includes('card'),
    promo_is_enabled: selectedPayments.value.includes('promo'),
    sbp_is_enabled: selectedPayments.value.includes('sbp'),
    split_is_enabled: selectedPayments.value.includes('split'),
    phone_payment_is_enabled: selectedPayments.value.includes('phone'),
    cash_is_enabled: selectedPayments.value.includes('cash'),
  }

  if (profile.value?.address !== undefined) {
    payload.address = restaurantAddress.value?.trim() ?? ''
  }
  if (profile.value?.payout_info !== undefined) {
    payload.payout_info = restaurantContact.value?.trim() ?? ''
  }
  if (profile.value?.description !== undefined) {
    payload.description = restaurantDescription.value?.trim() ?? ''
  }
  if (profile.value?.pause_text !== undefined) {
    payload.pause_text = pauseText.value?.trim() ?? ''
  }

  return payload
}

const openLogoPicker = () => {
  if (!isSaving.value) {
    logoInputRef.value?.click()
  }
}

const handleLogoChange = event => {
  const file = event.target.files?.[0]
  if (!file) {
    return
  }

  if (logoPreviewUrl.value) {
    URL.revokeObjectURL(logoPreviewUrl.value)
  }

  logoFile.value = file
  logoPreviewUrl.value = URL.createObjectURL(file)
}

const clearLogo = () => {
  if (logoPreviewUrl.value) {
    URL.revokeObjectURL(logoPreviewUrl.value)
  }
  logoPreviewUrl.value = null
  logoFile.value = null

  if (logoInputRef.value) {
    logoInputRef.value.value = ''
  }
}

const handleSave = async () => {
  if (isSaving.value || isLoading.value) {
    return
  }

  if (!profile.value) {
    console.error('Restaurant profile is not loaded.')
    return
  }

  const saved = await profileStore.saveSettings({
    payload: buildSettingsPayload(),
    logoFile: logoFile.value,
  })

  if (!saved) {
    return
  }

  if (logoFile.value) {
    clearLogo()
  }

  await loadProfile()

  toast.add({
    severity: 'success',
    summary: 'Успех',
    detail: 'Информация успешно обновлена',
    life: 3000,
  })

  router.replace({ name: 'profile' })
}

onMounted(loadProfile)
onBeforeUnmount(() => {
  if (logoPreviewUrl.value) {
    URL.revokeObjectURL(logoPreviewUrl.value)
  }
})
</script>

<template>
  <main class="settings-view">
    <div
      v-if="isLoading"
      class="settings-loader"
      role="status"
      aria-live="polite"
    >
      <span class="settings-loader__spinner" aria-label="Загрузка"></span>
    </div>
    <template v-else>
      <p v-if="errorMessage" class="settings-error" role="alert">
        {{ errorMessage }}
      </p>
      <section class="settings-section">
        <h2 class="settings-section__title">Фотография, логотип</h2>
        <div class="logo-card">
          <button
            class="logo-card__delete"
            type="button"
            aria-label="Удалить фото"
            @click="clearLogo"
          >
            <IconDelete class="logo-card__delete-icon" />
          </button>
          <div class="logo-card__preview" @click="openLogoPicker">
            <img
              v-if="logoUrl"
              :src="getImagePath(logoUrl)"
              alt="Логотип"
              class="logo-card__image"
            />
            <span v-else class="logo-card__text">{{ logoFallbackText }}</span>
          </div>
          <input
            ref="logoInputRef"
            type="file"
            class="logo-card__input"
            accept="image/*"
            @change="handleLogoChange"
          />
        </div>
      </section>

      <section class="settings-section">
        <h2 class="settings-section__title">Информация</h2>
        <div class="settings-section__fields">
          <AppInput
            v-model="restaurantName"
            name="restaurant-name"
            label="Название ресторана"
          />
          <AppInput
            v-model="restaurantAddress"
            name="restaurant-address"
            label="Адрес"
          />
          <AppInput
            v-model="restaurantContact"
            name="restaurant-contact"
            label="Контакты"
          />

          <AppTextarea
            v-model="restaurantDescription"
            name="restaurant-description"
            label="Описание"
            :rows="4"
          />

          <p class="settings-section__hint">
            Текст который будет видеть пользователь, если ресторан на паузе
          </p>

          <AppTextarea
            v-model="pauseText"
            name="restaurant-pause-text"
            label="Текст"
            :rows="3"
          />
        </div>
      </section>

      <div class="settings-submit">
        <AppButton
          text="Сохранить"
          accent
          block
          elevated
          :disabled="isSaving || isLoading"
          @click="handleSave"
        />
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/layout/colors' as *;

.settings-view {
  margin-top: 10px;
  padding: 12px 16px 90px;
  background-color: #ffffff;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section__title {
  font-size: 16px;
  font-weight: 700;
  color: #2c2c2c;
}

.settings-error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
}

.settings-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.settings-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2c3029;
  animation: settings-spin 0.8s linear infinite;
}

@keyframes settings-spin {
  to {
    transform: rotate(360deg);
  }
}

.logo-card {
  position: relative;
  width: 120px;
  margin: 0 auto;
}

.logo-card__preview {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  background-color: #0f6b38;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  overflow: hidden;
}

.logo-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-card__text {
  position: relative;
  padding-left: 10px;
}

.logo-card__text::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 50%;
  width: 8px;
  height: 2px;
  transform: translateY(-50%);
  background-color: #ff8a2a;
  border-radius: 1px;
}

.logo-card__delete {
  position: absolute;
  right: 12px;
  top: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff5a5f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.logo-card__delete-icon {
  width: 14px;
  height: 14px;
  color: #fff;
}

.logo-card__input {
  display: none;
}

.settings-section__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section__hint {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
}

.settings-submit {
  margin-top: 4px;
}
</style>
