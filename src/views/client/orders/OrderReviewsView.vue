<script setup>
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useNavigationStore} from '@/stores/client/navigation'
import {useOrderReviewsStore} from '@/stores/client/orderReviews'
import InfoCard from '@/components/InfoCard.vue'
import IconStar from '@/components/icons/IconStar.vue'
import RatingFilterChip from '@/components/client-orders/RatingFilterChip.vue'
import ReviewCard from '@/components/client-orders/ReviewCard.vue'

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore

changeTitle('Отзывы')
changeBackLinkVisible(true)

const reviewsStore = useOrderReviewsStore()
const {
  ratingFilters,
  activeRating,
  reviewsCount,
  averageRatingLabel,
  filteredReviews,
  isLoading,
} = storeToRefs(reviewsStore)

const {setRatingFilter, loadReviews} = reviewsStore

onMounted(loadReviews)
</script>

<template>
  <main>
    <div class="reviews-view">
      <div class="reviews-block">
        <div class="reviews-infos">
          <InfoCard :title="reviewsCount" subtitle="Отзывов получено"/>
          <InfoCard subtitle="Ваш рейтинг" class="reviews-rating-card">
            <template #title>
              <IconStar class="reviews-rating-card__icon"/>
              <span>{{ averageRatingLabel }}</span>
            </template>
          </InfoCard>
        </div>
      </div>

      <div class="reviews-block">
        <div class="reviews-filters">
          <RatingFilterChip
              v-for="filter in ratingFilters"
              :key="filter.id"
              :label="filter.label"
              :show-star="filter.showStar"
              :active="activeRating === filter.value"
              @click="setRatingFilter(filter.value)"
          />
        </div>
      </div>

      <div class="reviews-list">
        <div v-if="isLoading" class="reviews-loader" role="status" aria-live="polite">
          <span class="reviews-loader__spinner" aria-label="Загрузка"></span>
        </div>
        <template v-else>
          <ReviewCard
              v-for="review in filteredReviews"
              :key="review.id"
              :order-id="review.orderId"
              :time="review.time"
              :date="review.date"
              :rating="review.rating"
              :comment="review.comment"
          />
          <div v-if="filteredReviews.length === 0" class="reviews-empty">
            Нет отзывов
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.reviews-block {
  margin-top: 10px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
}

.reviews-infos {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
}

.reviews-filters {
  display: flex;
  align-items: center;
  column-gap: 10px;
  flex-wrap: wrap;
  row-gap: 10px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 140px;
}

.reviews-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.reviews-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: reviews-spin 0.8s linear infinite;
}

@keyframes reviews-spin {
  to {
    transform: rotate(360deg);
  }
}

.reviews-empty {
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
  padding: 24px 0;
}

.reviews-rating-card :deep(.info-card__top) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.reviews-rating-card__icon {
  width: 18px;
  height: 18px;
  color: $color-accent;
}
</style>
