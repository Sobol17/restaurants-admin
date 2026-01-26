<script setup>
import {onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useNavigationStore} from '@/stores/client/navigation'
import {useOrderAnalyticsStore} from '@/stores/client/orderAnalytics'
import InfoCard from '@/components/InfoCard.vue'
import ModalBottom from '@/components/ModalBottom.vue'
import Datepicker from '@/components/ui/Datepicker.vue'
import AppButton from '@/components/ui/AppButton.vue'
import IconAngleDown from '@/components/icons/IconAngleDown.vue'
import PopularDishCard from '@/components/client-orders/PopularDishCard.vue'

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore

changeTitle('Аналитика ресторана')
changeBackLinkVisible(true)

const analyticsStore = useOrderAnalyticsStore()
const {
  analytics,
  draftDateRange,
  dateStartLabel,
  dateEndLabel,
} = storeToRefs(analyticsStore)
const {openDateModal, applyDateFilter, resetDateFilter, loadAnalytics} = analyticsStore

const dateModal = ref(null)

onMounted(loadAnalytics)
</script>

<template>
  <main>
    <div class="analytics-view">
      <div class="analytics-block">
        <button type="button" class="analytics-dates" @click="openDateModal(dateModal)">
          <span class="analytics-dates__item">{{ dateStartLabel }}</span>
          <span class="analytics-dates__divider"></span>
          <span class="analytics-dates__item analytics-dates__item--end">{{ dateEndLabel }}</span>
          <IconAngleDown class="analytics-dates__icon"/>
        </button>
      </div>

      <div class="analytics-block">
        <div class="analytics-metrics">
          <InfoCard :title="analytics.totalRevenue" subtitle="Выручка"/>
          <InfoCard :title="analytics.averageBill" subtitle="Средний чек"/>
        </div>
        <div class="analytics-metrics analytics-metrics--single">
          <InfoCard :title="analytics.totalOrders" subtitle="Заказов в указанный период"/>
        </div>
      </div>

      <div class="analytics-block analytics-block--section">
        <div class="analytics-section">
          <div class="analytics-section__title">Популярные блюда</div>

          <div v-if="analytics.popularDishes?.length" class="analytics-section__list">
            <PopularDishCard
                v-for="dish in analytics.popularDishes"
                :key="dish.id"
                :title="dish.name"
                :orders="dish.totalOrdered"
            />
          </div>

          <div v-else class="analytics-section__list--empty">
            Нет данных
          </div>

        </div>
      </div>
    </div>

    <ModalBottom ref="dateModal">
      <div class="analytics-modal">
        <div class="analytics-modal__title">По дате</div>
        <Datepicker v-model="draftDateRange"/>
        <div class="analytics-modal__actions">
          <AppButton text="Сбросить" block @click="resetDateFilter(dateModal)"/>
          <AppButton text="Применить" accent block @click="applyDateFilter(dateModal)"/>
        </div>
      </div>
    </ModalBottom>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.analytics-block {
  margin-top: 10px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
}

.analytics-block--section {
  padding: 16px;
  margin-bottom: 140px;
}

.analytics-dates {
  width: 100%;
  border: none;
  background-color: $color-bg-muted;
  border-radius: 999px;
  padding: 10px 16px;
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.analytics-dates__item {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.analytics-dates__item--end {
  justify-self: center;
}

.analytics-dates__divider {
  width: 1px;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.08);
}

.analytics-dates__icon {
  width: 18px;
  height: 18px;
  color: #a3a3a3;
  justify-self: end;
}

.analytics-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.analytics-metrics--single {
  margin-top: 10px;
  grid-template-columns: 1fr;
}

.analytics-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analytics-section__title {
  font-size: 20px;
  font-weight: 700;
  color: #2c2c2c;
}

.analytics-section__list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &--empty {
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
  }
}

.analytics-modal {
  padding: 6px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analytics-modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
}

.analytics-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}
</style>
