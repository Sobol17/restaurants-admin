<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import {useRouter} from "vue-router";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
})

const router = useRouter();

const handleClick = () => {
  router.push(`${props.id}`);
}
</script>

<template>
  <div class="history-card">
    <div class="history-card__head">
      <div class="history-card__date">{{ time }}, {{ date }}</div>
      <div class="history-card__price">{{ price }}₽</div>
    </div>
    <div class="history-card__status">
      Статус: <span class="history-card__status__green">{{ status }}</span>
    </div>

    <AppButton text="Подробнее" block @click="handleClick"/>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.history-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 14px;

  &__head {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  &__date {
    font-size: 14px;
    font-weight: 600;
  }

  &__price {
    font-size: 20px;
    font-weight: 600;
    color: $color-accent;
  }

  &__status {
    margin-top: 6px;
    margin-bottom: 14px;
    font-size: 14px;
    color: $color-muted;

    &__green {
      color: #34C759;
    }
  }
}
</style>