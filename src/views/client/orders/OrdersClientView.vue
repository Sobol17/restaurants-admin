<script setup>
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useNavigationStore} from "@/stores/client/navigation";
import {useClientOrdersStore} from "@/stores/client/orders";
import CategoriesRow from "@/components/client-orders/CategoriesRow.vue";
import OrderCard from "@/components/client-orders/OrderCard.vue";

const navStore = useNavigationStore()
const {changeTitle} = navStore

changeTitle("Заказы")

const ordersStore = useClientOrdersStore();
const {categories, filteredOrders, activeCategoryId, isLoading} = storeToRefs(ordersStore);
const {loadOrders, setActiveCategory} = ordersStore;

onMounted(loadOrders);

const handleCategorySelect = (id) => {
  setActiveCategory(id);
};
</script>

<template>
  <main>
    <div class="orders-view">
      <div class="orders-view__title">Текущие заказы</div>

      <div class="orders-view__categories">
        <CategoriesRow
          :categories="categories"
          :active-id="activeCategoryId"
          @select="handleCategorySelect"
        />
      </div>

      <div class="orders-view__list">
        <div v-if="isLoading" class="orders-view__loader" role="status" aria-live="polite">
          <span class="orders-view__spinner" aria-label="Загрузка"></span>
        </div>
        <template v-else>
          <OrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order-id="order.id"
            :status="order.status"
            :status-code="order.statusCode"
            :price="order.price"
            :items="order.items"
            :order-number="order.orderNumber"
            :order-time="order.orderTime"
            :payment="order.payment"
            :address="order.address"
            :note="order.note"
          />
          <div v-if="filteredOrders.length === 0" class="orders-view__empty">
            Нет заказов
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.orders-view {
  background-color: #fff;
  border-radius: 6px 6px 0px 0px;
  margin-top: 10px;
  padding: 16px;

  &__title {
    font-size: 20px;
    font-weight: 600;
  }

  &__categories {
    margin-top: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    margin-top: 16px;
    margin-bottom: 80px;
  }

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
  }

  &__spinner {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 4px solid rgba(0, 0, 0, 0.08);
    border-top-color: #2C3029;
    animation: orders-spin 0.8s linear infinite;
  }

  &__empty {
    text-align: center;
    color: #8c8c8c;
    font-size: 14px;
    padding: 24px 0;
  }
}

@keyframes orders-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
