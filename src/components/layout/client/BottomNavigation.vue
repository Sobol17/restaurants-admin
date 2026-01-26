<script setup>
import {computed} from "vue";
import {useRoute} from "vue-router";
import IconMarket from "@/components/icons/IconMarket.vue";
import IconFood from "@/components/icons/IconFood.vue";
import IconSettings from "@/components/icons/IconSettings.vue";

const route = useRoute();
const activeTab = computed(() => {
  const match = [...route.matched].reverse().find((record) => record.meta?.bottomNav);
  return match?.meta?.bottomNav ?? null;
});

const isVisible = computed(() => {
  const match = [...route.matched].reverse().find((record) => record.meta?.bottomNav);
  return match ? !match.meta.hideBottomNav : true;
});
</script>

<template>
  <div v-if="isVisible" class="bottom-navigation">
    <RouterLink to="/client/orders" class="bottom-navigation__link"
                :class="{'bottom-navigation__link--active': activeTab === 'orders'}">
      <IconMarket/>
    </RouterLink>

    <RouterLink to="/client/menu" class="bottom-navigation__link"
                :class="{'bottom-navigation__link--active': activeTab === 'menu'}">
      <IconFood/>
    </RouterLink>

    <RouterLink to="/client/profile" class="bottom-navigation__link"
                :class="{'bottom-navigation__link--active': activeTab === 'profile'}">
      <IconSettings/>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.bottom-navigation {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 95px;
  padding: 1.25rem 2.75rem;
  background: var(--white-bg, #ffffff);
  border-radius: 6px 6px 0px 0px;
  box-shadow: 0px -8px 8px 0px rgba(0, 0, 0, 0.10);

  &__link {
    color: $color-muted;

    &--active {
      color: $color-accent;
    }
  }
}
</style>
