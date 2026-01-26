<script setup>
import {computed, ref, watch} from 'vue'
import IconAngleRight from '@/components/icons/IconAngleRight.vue'

const model = defineModel({
  type: Object,
  default: () => ({
    start: null,
    end: null,
  }),
})

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthNames = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const today = new Date()
const cursor = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const toDate = (value) => (value ? new Date(value) : null)
const isSameDay = (left, right) => {
  if (!left || !right) {
    return false
  }

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

const formatDate = (value) => `${value.getDate()} ${monthNames[value.getMonth()]} ${value.getFullYear()}`
const headerLabel = computed(() => {
  const start = toDate(model.value?.start)
  const end = toDate(model.value?.end)

  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  if (start) {
    return formatDate(start)
  }

  return `Сегодня, ${formatDate(today)}`
})

const currentYear = computed(() => cursor.value.getFullYear())
const currentMonth = computed(() => cursor.value.getMonth())
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
const startOffset = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return (firstDay + 6) % 7
})

const calendarDays = computed(() => {
  const items = []
  const slots = 42

  for (let index = 0; index < slots; index += 1) {
    const dayNumber = index - startOffset.value + 1
    if (dayNumber < 1 || dayNumber > daysInMonth.value) {
      items.push({key: `empty-${index}`, empty: true})
      continue
    }

    const date = new Date(currentYear.value, currentMonth.value, dayNumber)
    items.push({
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      empty: false,
      date,
      label: dayNumber,
    })
  }

  return items
})

const setRange = (start, end) => {
  model.value = {
    start: start ? new Date(start) : null,
    end: end ? new Date(end) : null,
  }
}

const selectDay = (date) => {
  const start = toDate(model.value?.start)
  const end = toDate(model.value?.end)

  if (!start || end) {
    setRange(date, null)
    return
  }

  if (isSameDay(date, start)) {
    setRange(start, null)
    return
  }

  if (date > start) {
    setRange(start, date)
    return
  }

  setRange(date, null)
}

const isInRange = (date) => {
  const start = toDate(model.value?.start)
  const end = toDate(model.value?.end)

  if (!start || !end) {
    return false
  }

  return date > start && date < end
}

const isRangeStart = (date) => isSameDay(date, toDate(model.value?.start))
const isRangeEnd = (date) => isSameDay(date, toDate(model.value?.end))
const isToday = (date) => isSameDay(date, today)

const goPrevMonth = () => {
  cursor.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const goNextMonth = () => {
  cursor.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

watch(
  () => model.value?.start,
  (value) => {
    const next = toDate(value)
    if (!next) {
      return
    }
    cursor.value = new Date(next.getFullYear(), next.getMonth(), 1)
  },
  {immediate: true}
)
</script>

<template>
  <div class="datepicker">
    <div class="datepicker__header">
      <button class="datepicker__nav" type="button" aria-label="Предыдущий месяц" @click="goPrevMonth">
        <IconAngleRight class="datepicker__nav-icon datepicker__nav-icon--prev"/>
      </button>
      <div class="datepicker__current">
        <span class="datepicker__calendar" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 2V5M17 2V5M3 9H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span>{{ headerLabel }}</span>
      </div>
      <button class="datepicker__nav" type="button" aria-label="Следующий месяц" @click="goNextMonth">
        <IconAngleRight class="datepicker__nav-icon"/>
      </button>
    </div>
    <div class="datepicker__weekdays">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>
    <div class="datepicker__grid">
      <template v-for="day in calendarDays" :key="day.key">
        <div v-if="day.empty" class="datepicker__day datepicker__day--empty"></div>
        <button
          v-else
          class="datepicker__day"
          type="button"
          :class="{
            'datepicker__day--range': isInRange(day.date),
            'datepicker__day--range-start': isRangeStart(day.date),
            'datepicker__day--range-end': isRangeEnd(day.date),
            'datepicker__day--today': isToday(day.date),
          }"
          @click="selectDay(day.date)"
        >
          {{ day.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.datepicker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.datepicker__header {
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  gap: 8px;
  padding: 12px 0 10px;
  border-top: 1px solid #f1f1f1;
}

.datepicker__nav {
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-muted;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.datepicker__nav:hover {
  background-color: $color-bg-muted;
  color: #2c3029;
}

.datepicker__nav-icon {
  width: 22px;
  height: 22px;
}

.datepicker__nav-icon--prev {
  transform: rotate(180deg);
}

.datepicker__current {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #2c3029;
  text-align: center;
}

.datepicker__calendar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: #2c3029;
}

.datepicker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: $color-muted;
  padding: 6px 0;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
}

.datepicker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding-bottom: 4px;
}

.datepicker__day {
  border: none;
  background: transparent;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  color: #2c3029;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.datepicker__day--empty {
  visibility: hidden;
  pointer-events: none;
}

.datepicker__day--range {
  background: #fbdac2;
}

.datepicker__day--range-start,
.datepicker__day--range-end {
  background: $color-accent;
  color: #fff;
  border-radius: 50%;
}

.datepicker__day--today {
  box-shadow: inset 0 0 0 1px rgba(255, 137, 47, 0.35);
}
</style>
