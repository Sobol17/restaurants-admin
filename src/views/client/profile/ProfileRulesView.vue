<script setup>
import {computed, onMounted, ref} from "vue";
import {useNavigationStore} from "@/stores/client/navigation";
import AppCheckbox from "@/components/ui/AppCheckbox.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import ModalBottom from "@/components/ModalBottom.vue";
import PaymentVariant from "@/components/profile/PaymentVariant.vue";
import {useProfileStore} from "@/stores/client/profile";
import {storeToRefs} from "pinia";

const navStore = useNavigationStore()
const {changeTitle, changeBackLinkVisible} = navStore

changeTitle("Правила заказов")
changeBackLinkVisible(true)

const paymentModal = ref(null);

const minOrderSum = ref("");
const freeDeliveryFrom = ref("");

const openPaymentModal = () => {
  paymentModal.value?.openModal();
};

const profileStore = useProfileStore();

const {
  selectedPayments,
  paymentVariants,
  profile,
  isLoading,
  isSaving,
  loadError,
  saveError,
} = storeToRefs(profileStore)
const {deletePaymentVariant} = profileStore

const applyPayments = () => {
  paymentModal.value?.closeModal();
};
const errorMessage = computed(() => loadError.value || saveError.value);

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const buildSettingsPayload = () => {
  const payload = {
    name: profile.value?.name ?? "",
    min_order_sum: toNumber(minOrderSum.value),
    free_delivery_from: toNumber(freeDeliveryFrom.value),
    working_hours: profile.value?.working_hours ?? {},
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
    errorMessage: "Failed to load restaurant rules.",
  });
  if (data) {
    minOrderSum.value = data?.min_order_sum ?? "";
    freeDeliveryFrom.value = data?.free_delivery_from ?? "";
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
    errorMessage: "Failed to update restaurant rules.",
  });
};

onMounted(loadProfile);
</script>

<template>
  <main>
    <div v-if="isLoading" class="rules-loader" role="status" aria-live="polite">
      <span class="rules-loader__spinner" aria-label="Загрузка"></span>
    </div>
    <div v-else class="rules-view">
      <p v-if="errorMessage" class="rules-error" role="alert">{{ errorMessage }}</p>
      <div class="rules-block">
        <div class="rules-block__title">Оплата</div>
        <div class="rules-block__inputs">
          <AppInput
            v-model="minOrderSum"
            name="min-price"
            label="Минимальная сумма заказа"
            suffix="₽"
            type="number"
          />
          <AppInput
            v-model="freeDeliveryFrom"
            name="delivery-blocker"
            label="Порог бесплатной доставки"
            suffix="₽"
            type="number"
          />
        </div>
      </div>

      <div class="rules-block">
        <div class="rules-block__title">Варианты способов оплаты</div>
        <div class="rules-block__variants">
          <button class="payment-add" type="button" @click="openPaymentModal">
            <span class="payment-add__icon" aria-hidden="true"></span>
            Добавить
          </button>
          <PaymentVariant
              v-for="item in paymentVariants" :key="item.id"
              :title="item.title"
              :subtitle="item.subtitle"
              @delete="deletePaymentVariant(item.id)"
          />
        </div>
      </div>

      <div class="rules-submit">
        <AppButton text="Сохранить" accent block elevated :disabled="isSaving || isLoading" @click="handleSave"/>
      </div>
    </div>

    <ModalBottom ref="paymentModal">
      <div class="payment-modal">
        <div class="payment-modal__title">Варианты способов оплаты</div>
        <div class="payment-modal__list">
          <AppCheckbox
              v-for="option in profileStore.paymentOptions"
              :key="option.id"
              v-model="selectedPayments"
              :value="option.id"
          >
            {{ option.label }}
          </AppCheckbox>
        </div>
        <div class="payment-modal__apply">
          <AppButton text="Применить" accent block @click="applyPayments"/>
        </div>
      </div>
    </ModalBottom>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/layout/colors" as *;

.rules-view {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding-bottom: 90px;
}

.rules-error {
  color: $color-danger;
  font-size: 14px;
  font-weight: 600;
  padding: 0 16px;
}

.rules-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.rules-loader__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #2C3029;
  animation: rules-spin 0.8s linear infinite;
}

@keyframes rules-spin {
  to {
    transform: rotate(360deg);
  }
}

.rules-block {
  background-color: #fff;
  padding: 16px;

  &__title {
    font-size: 20px;
    font-weight: 600;
  }

  &__inputs {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  &__variants {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
  }
}

.payment-add {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background-color: $color-bg-muted;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 500;
  color: $color-accent;
  cursor: pointer;
}

.payment-add__icon {
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.payment-add__icon::before,
.payment-add__icon::after {
  content: "";
  position: absolute;
  background-color: $color-accent;
  border-radius: 1px;
}

.payment-add__icon::before {
  width: 2px;
  height: 16px;
}

.payment-add__icon::after {
  width: 16px;
  height: 2px;
}

.payment-modal {
  padding: 6px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-modal__title {
  font-size: 20px;
  font-weight: 600;
  color: #2c2c2c;
}

.payment-modal__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-modal__apply {
  margin-top: 6px;
}

.rules-submit {
  padding: 16px;
}
</style>
