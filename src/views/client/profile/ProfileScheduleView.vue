<script setup>
import {storeToRefs} from "pinia";
import {computed, onMounted} from "vue";
import {useNavigationStore} from "@/stores/client/navigation";
import {useProfileStore} from "@/stores/client/profile";
import ScheduleDayCard from "@/components/profile/schedule/ScheduleDayCard.vue";
import AppButton from "@/components/ui/AppButton.vue";

const navStore = useNavigationStore();
const {changeTitle, changeBackLinkVisible} = navStore;

changeTitle("График работы");
changeBackLinkVisible(true);

const profileStore = useProfileStore();
const {scheduleDays, profile, selectedPayments, isLoading, isSaving, loadError, saveError} = storeToRefs(profileStore);

const {
  toggleDay,
  toggleBreaks,
  addBreak,
  updateDayTime,
  updateBreakTime,
} = profileStore;

const errorMessage = computed(() => loadError.value || saveError.value);

const normalizeTime = (value) => (typeof value === "string" ? value.trim() : "");

const timeToMinutes = (value) => {
  const normalized = normalizeTime(value);
  if (!normalized) {
    return null;
  }
  const [hours, minutes] = normalized.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
};

const normalizeIntervals = (intervals) => {
  if (!Array.isArray(intervals)) {
    return [];
  }

  return intervals
    .map(interval => [
      normalizeTime(interval?.[0]),
      normalizeTime(interval?.[1]),
    ])
    .filter(([start, end]) => start && end)
    .sort((a, b) => {
      const aMinutes = timeToMinutes(a[0]) ?? 0;
      const bMinutes = timeToMinutes(b[0]) ?? 0;
      return aMinutes - bMinutes;
    });
};

const applyWorkingHours = (workingHours) => {
  if (!workingHours || typeof workingHours !== "object") {
    return;
  }

  scheduleDays.value = scheduleDays.value.map((day) => {
    const intervals = normalizeIntervals(workingHours?.[day.id]?.open);
    if (intervals.length === 0) {
      return {
        ...day,
        enabled: false,
        breaksEnabled: false,
        breaks: [],
      };
    }

    const [firstStart] = intervals[0];
    const [, lastEnd] = intervals[intervals.length - 1];
    const breaks = [];

    for (let index = 0; index < intervals.length - 1; index += 1) {
      const currentEnd = intervals[index][1];
      const nextStart = intervals[index + 1][0];
      if (currentEnd && nextStart && currentEnd !== nextStart) {
        breaks.push({
          id: `${day.id}-${index + 1}`,
          from: currentEnd,
          to: nextStart,
        });
      }
    }

    return {
      ...day,
      enabled: true,
      time: {from: firstStart, to: lastEnd},
      breaksEnabled: breaks.length > 0,
      breaks,
    };
  });
};

const buildOpenIntervals = (day) => {
  if (!day.enabled) {
    return [];
  }

  const start = normalizeTime(day.time?.from);
  const end = normalizeTime(day.time?.to);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  if (!start || !end || startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return [];
  }

  if (!day.breaksEnabled || !Array.isArray(day.breaks) || day.breaks.length === 0) {
    return [[start, end]];
  }

  const breaks = day.breaks
    .map(item => ({
      from: normalizeTime(item.from),
      to: normalizeTime(item.to),
    }))
    .filter(item => item.from && item.to)
    .sort((a, b) => {
      const aMinutes = timeToMinutes(a.from) ?? 0;
      const bMinutes = timeToMinutes(b.from) ?? 0;
      return aMinutes - bMinutes;
    });

  const intervals = [];
  let currentStart = start;

  breaks.forEach((breakItem) => {
    const breakStartMinutes = timeToMinutes(breakItem.from);
    const currentStartMinutes = timeToMinutes(currentStart);

    if (
      breakStartMinutes !== null &&
      currentStartMinutes !== null &&
      breakStartMinutes > currentStartMinutes
    ) {
      intervals.push([currentStart, breakItem.from]);
    }
    currentStart = breakItem.to;
  });

  const currentStartMinutes = timeToMinutes(currentStart);
  if (currentStartMinutes !== null && endMinutes !== null && endMinutes > currentStartMinutes) {
    intervals.push([currentStart, end]);
  }

  return intervals.filter(([openStart, openEnd]) => openStart && openEnd);
};

const buildWorkingHoursPayload = () => {
  const workingHours = {};
  scheduleDays.value.forEach((day) => {
    workingHours[day.id] = {open: buildOpenIntervals(day)};
  });
  return workingHours;
};

const buildSettingsPayload = () => {
  const payload = {
    name: profile.value?.name ?? "",
    min_order_sum: profile.value?.min_order_sum ?? 0,
    free_delivery_from: profile.value?.free_delivery_from ?? 0,
    working_hours: buildWorkingHoursPayload(),
    is_paused: profile.value?.is_paused ?? false,
    latitude: profile.value?.latitude ?? 0,
    longitude: profile.value?.longitude ?? 0,
    payout_info: profile.value?.payout_info ?? "",
    cuisines: profile.value?.cuisines ?? [],
    card_is_enabled: selectedPayments.value.includes("card"),
    promo_is_enabled: selectedPayments.value.includes("promo"),
    sbp_is_enabled: selectedPayments.value.includes("sbp"),
    split_is_ebabled: selectedPayments.value.includes("split"),
    phone_payment_is_enabled: selectedPayments.value.includes("phone"),
    cash_is_enabled: selectedPayments.value.includes("cash"),
  };

  if (profile.value?.address !== undefined) {
    payload.address = profile.value.address;
  }
  if (profile.value?.description !== undefined) {
    payload.description = profile.value.description;
  }
  if (profile.value?.pause_text !== undefined) {
    payload.pause_text = profile.value.pause_text;
  }

  return payload;
};

const loadProfile = async () => {
  const data = await profileStore.loadProfile({
    errorMessage: "Failed to load restaurant schedule.",
  });
  if (data) {
    applyWorkingHours(data?.working_hours);
  }
};

const handleSave = async () => {
  if (isSaving.value || isLoading.value) {
    return;
  }

  if (!profile.value) {
    console.error("Restaurant profile is not loaded.");
    return;
  }

  await profileStore.saveSettings({
    payload: buildSettingsPayload(),
    errorMessage: "Failed to update restaurant schedule.",
  });
};

const handleDayTimeChange = (dayId, field, value) => {
  updateDayTime(dayId, field, value);
};

const handleBreakTimeChange = (dayId, breakId, field, value) => {
  updateBreakTime(dayId, breakId, field, value);
};

onMounted(loadProfile);
</script>

<template>
  <main class="schedule-view">
    <div v-if="isLoading" class="schedule-loader" role="status" aria-live="polite">
      <span class="schedule-loader__spinner" aria-label="Загрузка"></span>
    </div>
    <template v-else>
      <p v-if="errorMessage" class="schedule-error" role="alert">{{ errorMessage }}</p>
      <div class="schedule-view__list">
        <ScheduleDayCard
          v-for="day in scheduleDays"
          :key="day.id"
          :day="day"
          @toggle-day="toggleDay"
          @toggle-breaks="toggleBreaks"
          @update-day-time="handleDayTimeChange"
          @update-break-time="handleBreakTimeChange"
          @add-break="addBreak"
        />
      </div>
      <div class="schedule-view__actions">
        <AppButton text="Сохранить" accent block elevated :disabled="isSaving || isLoading" @click="handleSave"/>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;
.schedule-view {
  padding: 12px 16px 80px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 100px);
}

.schedule-error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.schedule-view__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.schedule-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: schedule-spin 0.8s linear infinite;
}

@keyframes schedule-spin {
  to {
    transform: rotate(360deg);
  }
}

.schedule-view__actions {
  margin-top: 12px;
}
</style>
