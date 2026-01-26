<script setup>
import AppSwitch from "@/components/ui/AppSwitch.vue";
import ScheduleTimeField from "@/components/profile/schedule/ScheduleTimeField.vue";

const props = defineProps({
  day: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "toggle-day",
  "toggle-breaks",
  "update-day-time",
  "update-break-time",
  "add-break",
]);

const handleToggleDay = (value) => emit("toggle-day", props.day.id, value);
const handleToggleBreaks = (value) => emit("toggle-breaks", props.day.id, value);
const handleAddBreak = () => emit("add-break", props.day.id);

const handleDayTimeChange = (field, value) => {
  emit("update-day-time", props.day.id, field, value);
};

const handleBreakTimeChange = (breakId, field, value) => {
  emit("update-break-time", props.day.id, breakId, field, value);
};
</script>

<template>
  <section class="schedule-day">
    <div class="schedule-day__header">
      <span class="schedule-day__title">{{ day.title }}</span>
      <AppSwitch :model-value="day.enabled" @update:modelValue="handleToggleDay"/>
    </div>

    <div v-if="day.enabled" class="schedule-day__content">
      <div class="schedule-day__row">
        <ScheduleTimeField
            label="с"
            :model-value="day.time.from"
            @update:modelValue="(value) => handleDayTimeChange('from', value)"
        />
        <ScheduleTimeField
            label="до"
            :model-value="day.time.to"
            @update:modelValue="(value) => handleDayTimeChange('to', value)"
        />
      </div>

      <div class="schedule-day__breaks">
        <div class="schedule-day__row schedule-day__row--between">
          <span class="schedule-day__subtitle">Перерыв</span>
          <AppSwitch :model-value="day.breaksEnabled" @update:modelValue="handleToggleBreaks"/>
        </div>

        <div v-if="day.breaksEnabled" class="schedule-day__break-list">
          <div
              v-for="breakItem in day.breaks"
              :key="breakItem.id"
              class="schedule-day__row"
          >
            <ScheduleTimeField
                label="с"
                :model-value="breakItem.from"
                @update:modelValue="(value) => handleBreakTimeChange(breakItem.id, 'from', value)"
            />
            <ScheduleTimeField
                label="до"
                :model-value="breakItem.to"
                @update:modelValue="(value) => handleBreakTimeChange(breakItem.id, 'to', value)"
            />
          </div>

          <button class="schedule-day__add-break" type="button" @click="handleAddBreak">
            <span class="schedule-day__add-icon" aria-hidden="true"></span>
            Добавить еще перерыв
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.schedule-day {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #ededed;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.schedule-day__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.schedule-day__title {
  font-size: 16px;
  font-weight: 500;
  color: #2c2c2c;
}

.schedule-day__content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-day__row {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #ededed;
  padding: 6px 0px;

  &:not(&:last-child) {
    border-bottom: 1px solid #ededed;
  }
}

.schedule-day__row--between {
  justify-content: space-between;
  border: none;

  &:not(&:last-child) {
    border-bottom: none;
  }
}

.schedule-day__subtitle {
  font-size: 16px;
  color: #3a3a3a;
  font-weight: 500;
}

.schedule-day__breaks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-day__break-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-day__add-break {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #ff8a2a;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 0;
  cursor: pointer;
}

.schedule-day__add-icon {
  width: 14px;
  height: 14px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.schedule-day__add-icon::before,
.schedule-day__add-icon::after {
  content: "";
  position: absolute;
  background-color: #ff8a2a;
  border-radius: 1px;
}

.schedule-day__add-icon::before {
  width: 2px;
  height: 12px;
}

.schedule-day__add-icon::after {
  width: 12px;
  height: 2px;
}
</style>
