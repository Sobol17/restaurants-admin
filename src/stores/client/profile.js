// stores/auth.js
import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {
    getRestaurantProfile,
    updateRestaurantImages,
    updateRestaurantSettings,
} from "@/api/clientRestaurants";
import {waitForRestaurantId} from "@/utils/restaurantId";

export const useProfileStore = defineStore('profile', () => {
    const profile = ref(null);
    const restaurantId = ref(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const loadError = ref("");
    const saveError = ref("");

    const paymentVariantCatalog = [
        {
            id: "card",
            title: "Банковской картой",
            subtitle: "Visa, Mastercard, Maestro и Мир",
            label: "Банковской картой",
        },
        {
            id: "cash",
            title: "Наличными",
            subtitle: "Оплата наличными при получении",
            label: "Наличными",
        },
        {
            id: "sbp",
            title: "Система быстрых платежей (СБП)",
            subtitle: "QR-коду или ссылка",
            label: "Система быстрых платежей (СБП)",
        },
        {
            id: "split",
            title: "Сплит",
            subtitle: "Разделить стоимость покупки на несколько платежей",
            label: "Сплит",
        },
        {
            id: "phone",
            title: "Перевод по номеру",
            subtitle: "На номер телефона",
            label: "Перевод по номеру",
        },
        {
            id: "promo",
            title: "Акция в меню",
            subtitle: "Промо-предложения в меню",
            label: "Акция в меню",
        },
    ];

    const selectedPayments = ref(["card", "sbp", "split"]);

    const paymentVariants = computed(() => {
        return paymentVariantCatalog
            .filter((item) => selectedPayments.value.includes(item.id))
            .map(({id, title, subtitle}) => ({id, title, subtitle}));
    });

    const paymentOptions = paymentVariantCatalog.map(({id, label}) => ({id, label}));

    const deletePaymentVariant = (id) => {
        selectedPayments.value = selectedPayments.value.filter((item) => item !== id);
    }

    const syncPaymentsFromProfile = (data) => {
        if (!data || typeof data !== "object") {
            return;
        }

        const fields = [
            "card_is_enabled",
            "promo_is_enabled",
            "sbp_is_enabled",
            "split_is_enabled",
            "phone_payment_is_enabled",
            "cash_is_enabled",
        ];

        const hasPaymentFields = fields.some((field) => (
            Object.prototype.hasOwnProperty.call(data, field)
        ));

        if (!hasPaymentFields) {
            return;
        }

        const nextPayments = [];
        if (data.card_is_enabled) {
            nextPayments.push("card");
        }
        if (data.promo_is_enabled) {
            nextPayments.push("promo");
        }
        if (data.sbp_is_enabled) {
            nextPayments.push("sbp");
        }
        if (data.phone_payment_is_enabled) {
            nextPayments.push("phone");
        }
        if (data.cash_is_enabled) {
            nextPayments.push("cash");
        }

        selectedPayments.value = nextPayments;
    };

    const scheduleDays = ref([
        {
            id: "mon",
            title: "Понедельник",
            enabled: true,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: true,
            breaks: [
                {id: "mon-1", from: "12:00", to: "13:00"},
                {id: "mon-2", from: "17:00", to: "17:30"},
            ],
        },
        {
            id: "tue",
            title: "Вторник",
            enabled: true,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
        {
            id: "wed",
            title: "Среда",
            enabled: true,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
        {
            id: "thu",
            title: "Четверг",
            enabled: true,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
        {
            id: "fri",
            title: "Пятница",
            enabled: true,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
        {
            id: "sat",
            title: "Суббота",
            enabled: false,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
        {
            id: "sun",
            title: "Воскресенье",
            enabled: false,
            time: {from: "07:00", to: "22:00"},
            breaksEnabled: false,
            breaks: [],
        },
    ]);

    const toggleDay = (dayId, value) => {
        scheduleDays.value = scheduleDays.value.map((day) => (
            day.id === dayId ? {...day, enabled: value} : day
        ));
    };

    const toggleBreaks = (dayId, value) => {
        scheduleDays.value = scheduleDays.value.map((day) => {
            if (day.id !== dayId) {
                return day;
            }

            const nextBreaks = value && day.breaks.length === 0
                ? [{id: `${dayId}-1`, from: "12:00", to: "13:00"}]
                : day.breaks;

            return {...day, breaksEnabled: value, breaks: nextBreaks};
        });
    };

    const updateDayTime = (dayId, field, value) => {
        scheduleDays.value = scheduleDays.value.map((day) => (
            day.id === dayId ? {...day, time: {...day.time, [field]: value}} : day
        ));
    };

    const updateBreakTime = (dayId, breakId, field, value) => {
        scheduleDays.value = scheduleDays.value.map((day) => {
            if (day.id !== dayId) {
                return day;
            }

            const nextBreaks = day.breaks.map((item) => (
                item.id === breakId ? {...item, [field]: value} : item
            ));

            return {...day, breaks: nextBreaks};
        });
    };

    const addBreak = (dayId) => {
        scheduleDays.value = scheduleDays.value.map((day) => {
            if (day.id !== dayId) {
                return day;
            }

            const presets = [
                {from: "12:00", to: "13:00"},
                {from: "17:00", to: "17:30"},
                {from: "19:00", to: "19:30"},
            ];
            const preset = presets[day.breaks.length] || presets[0];
            const nextBreak = {
                id: `${dayId}-${day.breaks.length + 1}`,
                from: preset.from,
                to: preset.to,
            };

            return {...day, breaks: [...day.breaks, nextBreak]};
        });
    };

    const ensureRestaurantId = async () => {
        if (restaurantId.value) {
            return restaurantId.value;
        }

        const id = await waitForRestaurantId();
        restaurantId.value = id;
        return id;
    };

    const loadProfile = async ({errorMessage} = {}) => {
        loadError.value = "";
        saveError.value = "";
        isLoading.value = true;
        try {
            const id = await ensureRestaurantId();
            if (!id) {
                return null;
            }
            const data = await getRestaurantProfile(id);
            profile.value = data;
            syncPaymentsFromProfile(data);
            return data;
        } catch (error) {
            loadError.value = errorMessage || "Failed to load restaurant profile.";
            console.error(loadError.value, error);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const saveSettings = async ({payload, logoFile, errorMessage} = {}) => {
        if (isSaving.value) {
            return false;
        }

        saveError.value = "";
        loadError.value = "";
        isSaving.value = true;
        try {
            await updateRestaurantSettings(payload);

            if (logoFile) {
                const id = await ensureRestaurantId();
                if (id) {
                    const formData = new FormData();
                    formData.append("restaurant_id", id);
                    formData.append("logo_url", logoFile);
                    await updateRestaurantImages(formData);
                }
            }

            return true;
        } catch (error) {
            saveError.value = errorMessage || "Failed to update restaurant settings.";
            console.error(saveError.value, error);
            return false;
        } finally {
            isSaving.value = false;
        }
    };

    const clearCache = () => {
        restaurantId.value = null
        profile.value = null
    }

    return {
        profile,
        restaurantId,
        isLoading,
        isSaving,
        loadError,
        saveError,
        selectedPayments,
        paymentVariants,
        paymentOptions,
        deletePaymentVariant,
        scheduleDays,
        toggleDay,
        toggleBreaks,
        updateDayTime,
        updateBreakTime,
        addBreak,
        loadProfile,
        saveSettings,
        clearCache,
    }
})
