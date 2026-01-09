import {useAuthStore} from '@/stores/auth'

import {createRouter, createWebHistory} from 'vue-router'
import ClientLayout from "@/components/layout/client/ClientLayout.vue";
import AdminLayout from "@/components/layout/admin/AdminLayout.vue";
import DashboardView from "@/views/admin/DashboardView.vue";
import LoginView from "@/views/admin/auth/LoginView.vue";
import AccessView from "@/views/admin/auth/AccessView.vue";
import ErrorView from "@/views/admin/auth/ErrorView.vue";
import ProfileView from "@/views/client/profile/ProfileView.vue";
import AdsView from "@/views/admin/AdsView.vue";
import RegisterView from "@/views/admin/auth/RegisterView.vue";
import RestaurantsView from "@/views/admin/RestaurantsView.vue";
import CustomersView from "@/views/admin/CustomersView.vue";
import CouriersView from "@/views/admin/CouriersView.vue";
import OrdersView from "@/views/admin/OrdersView.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        // Client template
        {
            path: '/client',
            component: ClientLayout,
            children: [
                {
                    path: 'profile',
                    name: 'profile',
                    component: ProfileView,
                },
            ],
        },
        // Admin template
        {
            path: '/admin',
            component: AdminLayout,
            redirect: {name: 'dashboard'},
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: DashboardView,
                },
                {
                    path: 'ads',
                    name: 'ads',
                    component: AdsView,
                },
                {
                    path: 'restaurants',
                    name: 'restaurants',
                    component: RestaurantsView,
                },
                {
                    path: 'users',
                    name: 'users',
                    component: CustomersView,
                },
                {
                    path: 'couriers',
                    name: 'couriers',
                    component: CouriersView,
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: OrdersView,
                },
            ],
        },

        // Auth templates
        {
            path: '/auth',
            name: 'auth',
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: LoginView,
                },
                {
                    path: 'register',
                    name: 'register',
                    component: RegisterView,
                },
                {
                    path: 'access',
                    name: 'accessDenied',
                    component: AccessView,
                },
                {
                    path: 'error',
                    name: 'error',
                    component: ErrorView,
                },
            ]
        },

    ],
})

router.beforeEach((to, from, next) => {
        const authStore = useAuthStore()

        const isAuthenticated = !!authStore.getAccessToken()

        if (isAuthenticated && to.name === 'login') {
            next({name: 'dashboard'})
            return
        }

        if (!isAuthenticated && !['login', 'accessDenied', 'error', 'register'].includes(to.name)) {
            next({name: 'accessDenied'})
            return
        }

        next()
    }
)

export default router
