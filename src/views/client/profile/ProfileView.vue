<script setup>
import IconDelete from '@/components/icons/IconDelete.vue'
import IconDocument from '@/components/icons/IconDocument.vue'
import IconDocumentBlank from '@/components/icons/IconDocumentBlank.vue'
import IconLogout from '@/components/icons/IconLogout.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconPrivacy from '@/components/icons/IconPrivacy.vue'
import IconProfileSettings from '@/components/icons/IconProfileSettings.vue'
import ProfileRow from '@/components/profile/ProfileRow.vue'
import AppSwitch from '@/components/ui/AppSwitch.vue'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/client/menu'
import { useNavigationStore } from '@/stores/client/navigation'
import { useProfileStore } from '@/stores/client/profile'
import { getImagePath } from '@/utils/getImagePath'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const navStore = useNavigationStore()
const { changeTitle } = navStore

changeTitle('Профиль')

const profileStore = useProfileStore()
const { profile, isLoading, loadError } = storeToRefs(profileStore)

const authStore = useAuthStore()
const menuStore = useMenuStore()
const router = useRouter()

function handleLogout() {
  authStore.clearSession()
  profileStore.clearCache()
  menuStore.clearCache()
  router.push('/auth/login')
}

const profileName = computed(() => profile.value?.name ?? 'Название')
const profileAvatar = computed(
  () =>
    profile.value?.logo_url ||
    profile.value?.image_url ||
    'https://placehold.co/110',
)

onMounted(() => {
  profileStore.loadProfile()
})

const firstMenuList = [
  {
    title: 'Общие настройки ресторана',
    link: 'profile/settings',
    icon: IconProfileSettings,
  },
  {
    title: 'Правила заказов',
    link: 'profile/rules',
    icon: IconDocument,
  },
  {
    title: 'График работы',
    link: 'profile/schedule',
    icon: IconDocumentBlank,
  },
]

const secondMenuList = [
  {
    title: 'Политика конфиденциальности',
    link: 'client/profile/settings',
    icon: IconPrivacy,
  },
  {
    title: 'Служба поддержки',
    link: 'client/profile',
    icon: IconMessage,
  },
  {
    title: 'Условия использования',
    link: 'client/profile',
    icon: IconDocumentBlank,
  },
]

const thirdMenuList = [
  {
    title: 'Удалить аккаунт',
    link: 'client/profile',
    icon: IconDelete,
  },
  {
    title: 'Выйти',
    red: true,
    icon: IconLogout,
    action: handleLogout,
  },
]
</script>

<template>
  <main>
    <div class="profile-view">
      <div
        v-if="isLoading"
        class="profile-loader"
        role="status"
        aria-live="polite"
      >
        <span class="profile-loader__spinner" aria-label="Загрузка"></span>
      </div>
      <template v-else>
        <p v-if="loadError" class="profile-error" role="alert">
          {{ loadError }}
        </p>
        <img
          class="profile-avatar"
          :src="getImagePath(profileAvatar)"
          :alt="profileName"
        />
        <div class="profile-name">{{ profileName }}</div>

        <div class="profile-block">
          <div
            v-for="item in firstMenuList"
            :key="item.link"
            class="profile-block__item"
          >
            <ProfileRow
              :title="item.title"
              :link="item.link"
              :icon="item.icon"
            />
          </div>
          <div class="profile-block__switch">
            <p>Статус работы</p>
            <AppSwitch />
          </div>
        </div>

        <div class="profile-block">
          <div
            v-for="item in secondMenuList"
            :key="item.link"
            class="profile-block__item"
          >
            <ProfileRow
              :title="item.title"
              :link="item.link"
              :icon="item.icon"
            />
          </div>
        </div>

        <div class="profile-block">
          <div
            v-for="item in thirdMenuList"
            :key="item.title"
            class="profile-block__item"
          >
            <ProfileRow
              :title="item.title"
              :link="item.link"
              :icon="item.icon"
              :invalid="item.red"
              :action="item.action"
            />
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/layout/colors' as *;

.profile-view {
  background-color: #fff;
  padding: 16px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: center;
}

.profile-avatar {
  border-radius: 50%;
  max-width: 100%;
  width: 110px;
  height: 110px;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
}

.profile-error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.profile-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.profile-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2c3029;
  animation: profile-spin 0.8s linear infinite;
}

@keyframes profile-spin {
  to {
    transform: rotate(360deg);
  }
}

.profile-block {
  background-color: $color-bg-muted;
  border-radius: 12px;
  padding: 12px 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  &__item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 12px;
  }

  &__item.red {
    color: $color-danger;
  }

  &__switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
