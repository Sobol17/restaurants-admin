<script setup>
import {useRouter} from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import RatingStars from '@/components/ui/RatingStars.vue'

const props = defineProps({
  orderId: {
    type: [String, Number],
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
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const handleClick = () => {
  router.push({name: 'client-order-detail', params: {orderId: String(props.orderId)}})
}
</script>

<template>
  <article class="review-card">
    <div class="review-card__head">
      <div class="review-card__meta">
        <div class="review-card__date">{{ time }}, {{ date }}</div>
        <div class="review-card__order">
          Заказ: <span class="review-card__order-id">{{ orderId }}</span>
        </div>
      </div>
      <RatingStars :value="rating" :size="18"/>
    </div>

    <div class="review-card__comment">{{ comment }}</div>

    <AppButton text="Перейти к заказу" block @click="handleClick"/>
  </article>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.review-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.review-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-card__date {
  font-size: 14px;
  font-weight: 600;
  color: #2c2c2c;
}

.review-card__order {
  font-size: 13px;
  color: $color-muted;
}

.review-card__order-id {
  color: #34C759;
  font-weight: 600;
}

.review-card__comment {
  background-color: $color-bg-muted;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  color: #2c2c2c;
}
</style>
