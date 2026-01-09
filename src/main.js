import {VueQueryPlugin} from "@tanstack/vue-query";
import {createPinia} from "pinia";
import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";

import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

import "@/assets/styles.scss";
import {definePreset} from "@primeuix/themes";

const pinia = createPinia();
const app = createApp(App);

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{amber.50}",
            100: "{amber.100}",
            200: "{amber.200}",
            300: "{amber.300}",
            400: "{amber.400}",
            500: "{amber.500}",
            600: "{amber.600}",
            700: "{amber.700}",
            800: "{amber.800}",
            900: "{amber.900}",
            950: "{amber.950}",
        },
    },
});

app.use(router);
app.use(pinia);
app.use(VueQueryPlugin);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: ".app-dark",
        },
    },
    locale: {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить',
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        weak: 'Слабая',
        medium: 'Средняя',
        strong: 'Сильная',
        passwordPrompt: 'Введите пароль',
        emptyFilterMessage: 'Результаты не найдены',
        emptyMessage: 'Нет доступных опций',
        accept: 'Да',
        reject: 'Нет',
        choose: 'Выбрать',
        upload: 'Загрузить',
        cancel: 'Отмена',
        completed: 'Завершено',
        pending: 'В ожидании'
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
