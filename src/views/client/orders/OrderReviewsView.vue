<script setup>
import {ref} from "vue";
import {useNavigationStore} from "@/stores/client/navigation";
import InfoCard from "@/components/InfoCard.vue";
import FilterChip from "@/components/client-orders/FilterChip.vue";
import ModalBottom from "@/components/ModalBottom.vue";
import AppButton from "@/components/ui/AppButton.vue";
import Datepicker from "@/components/ui/Datepicker.vue";
import {useHistoryStore} from "@/stores/client/orderHistory";
import {storeToRefs} from "pinia";
import HistoryCard from "@/components/client-orders/HistoryCard.vue";

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore

changeTitle("История заказов")
changeBackLinkVisible(true)

const historyStore = useHistoryStore()
const {
  filterStatuses,
  countOrders,
  totalSum,
  draftStatusIds,
  draftDateRange,
  isStatusFilterActive,
  isDateFilterActive,
  statusFilterLabel,
  dateFilterLabel,
  historyItems
} = storeToRefs(historyStore)
const {
  openStatusModal,
  openDateModal,
  toggleStatus,
  applyStatusFilter,
  resetStatusFilter,
  applyDateFilter,
  resetDateFilter,
} = historyStore

const statusModal = ref(null)
const dateModal = ref(null)
</script>

<template>
  <main>
    <div class="history-view">
      <div class="history-block">
        <div class="history-infos">
          <InfoCard :title="countOrders" subtitle="Количество заказов"/>
          <InfoCard :title="totalSum" subtitle="Выручка за период"/>
        </div>
      </div>

      <div class="history-block">
        <div class="history-filters">
          <FilterChip :label="statusFilterLabel" :active="isStatusFilterActive" @change="openStatusModal(statusModal)"/>
          <FilterChip :label="dateFilterLabel" :active="isDateFilterActive" @change="openDateModal(dateModal)"/>
        </div>
      </div>

      <div class="history-list">
        <HistoryCard
            v-for="(item, index) in historyItems"
            :key="index"
            :id="item.id"
            :price="item.price"
            :status="item.status"
            :date="item.date"
            :time="item.time"
        />
      </div>
    </div>

    <ModalBottom ref="statusModal">
      <div class="history-modal">
        <div class="history-modal__title">По статусу</div>
        <div class="history-modal__chips">
          <button
              v-for="status in filterStatuses"
              :key="status.id"
              type="button"
              class="history-modal__chip"
              :class="{'history-modal__chip--active': draftStatusIds.includes(status.id)}"
              @click="toggleStatus(status.id)"
          >
            {{ status.label }}
          </button>
        </div>
        <div class="history-modal__actions">
          <AppButton text="Сбросить" block @click="resetStatusFilter(statusModal)"/>
          <AppButton text="Применить" accent block @click="applyStatusFilter(statusModal)"/>
        </div>
      </div>
    </ModalBottom>

    <ModalBottom ref="dateModal">
      <div class="history-modal">
        <div class="history-modal__title">По дате</div>
        <Datepicker v-model="draftDateRange"/>
        <div class="history-modal__actions">
          <AppButton text="Сбросить" block @click="resetDateFilter(dateModal)"/>
          <AppButton text="Применить" accent block @click="applyDateFilter(dateModal)"/>
        </div>
      </div>
    </ModalBottom>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.history-block {
  margin-top: 10px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
}

.history-infos {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
}

.history-filters {
  display: flex;
  align-items: center;
  column-gap: 10px;
  flex-wrap: wrap;
  row-gap: 10px;
}

.history-list {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 140px;
}

.history-modal {
  padding: 6px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
}

.history-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-modal__chip {
  border: none;
  background-color: $color-bg-muted;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  color: #2c2c2c;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.history-modal__chip--active {
  background-color: $color-accent;
  color: #fff;
}

.history-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}
</style>
