import AdminLayout from '@/components/layout/admin/AdminLayout.vue'
import ClientLayout from '@/components/layout/client/ClientLayout.vue'
import { useAuthStore } from '@/stores/auth'
import AdsView from '@/views/admin/AdsView.vue'
import AccessView from '@/views/admin/auth/AccessView.vue'
import ErrorView from '@/views/admin/auth/ErrorView.vue'
import LoginView from '@/views/admin/auth/LoginView.vue'
import RegisterView from '@/views/admin/auth/RegisterView.vue'
import CouriersView from '@/views/admin/CouriersView.vue'
import CustomersView from '@/views/admin/CustomersView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import OrdersView from '@/views/admin/OrdersView.vue'
import RestaurantsView from '@/views/admin/RestaurantsView.vue'
import MenuCategoryListView from '@/views/client/menu/MenuCategoryListView.vue'
import MenuCategoryView from '@/views/client/menu/MenuCategoryView.vue'
import MenuDishView from '@/views/client/menu/MenuDishView.vue'
import MenuSearchView from '@/views/client/menu/MenuSearchView.vue'
import MenuView from '@/views/client/menu/MenuView.vue'
import OrderAnalyticsView from '@/views/client/orders/OrderAnalyticsView.vue'
import OrderDetailView from '@/views/client/orders/OrderDetailView.vue'
import OrderHistoryView from '@/views/client/orders/OrderHistoryView.vue'
import OrderReviewsView from '@/views/client/orders/OrderReviewsView.vue'
import OrdersClientView from '@/views/client/orders/OrdersClientView.vue'
import ProfileRulesView from '@/views/client/profile/ProfileRulesView.vue'
import ProfileScheduleView from '@/views/client/profile/ProfileScheduleView.vue'
import ProfileSettingsView from '@/views/client/profile/ProfileSettingsView.vue'
import ProfileView from '@/views/client/profile/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const getDefaultAuthenticatedRoute = authStore => {
  if (authStore.getUserRole() === 'restaurant_owner') {
    return { name: 'profile' }
  }

  return { name: 'dashboard' }
}

const syncTokenFromRoute = (route, authStore) => {
  const routeToken = route?.query?.token
  const token = Array.isArray(routeToken) ? routeToken[0] : routeToken

  if (typeof token === 'string' && token.trim() !== '') {
    authStore.setAccessToken(token)
  }
}

const syncRestaurantIdFromRoute = route => {
  const raw = route?.query?.restaurantId
  const restaurantId = Array.isArray(raw) ? raw[0] : raw

  if (typeof restaurantId === 'string' && restaurantId.trim() !== '') {
    localStorage.setItem('restaurant_id', restaurantId)
  }
}

const router = createRouter({
  history: createWebHistory('/front/'),
  routes: [
    {
      path: '/',
      redirect: '/admin',
    },
    // Client template
    {
      path: '/client',
      component: ClientLayout,
      redirect: { name: 'profile' },
      children: [
        // profile
        {
          path: 'profile',
          children: [
            {
              path: '',
              name: 'profile',
              component: ProfileView,
              meta: { bottomNav: 'profile' },
            },
            {
              path: 'settings',
              name: 'profile-settings',
              component: ProfileSettingsView,
              meta: { bottomNav: 'profile' },
            },
            {
              path: 'rules',
              name: 'profile-rules',
              component: ProfileRulesView,
              meta: { bottomNav: 'profile' },
            },
            {
              path: 'schedule',
              name: 'profile-schedule',
              component: ProfileScheduleView,
              meta: { bottomNav: 'profile' },
            },
          ],
        },
        //orders
        {
          path: 'orders',
          children: [
            {
              path: '',
              name: 'client-orders',
              component: OrdersClientView,
              meta: { bottomNav: 'orders' },
            },
            {
              path: ':orderId',
              name: 'client-order-detail',
              component: OrderDetailView,
              meta: { bottomNav: 'orders', hideBottomNav: true },
            },
            {
              path: 'history',
              name: 'client-order-history',
              component: OrderHistoryView,
              meta: { bottomNav: 'orders' },
            },
            {
              path: 'analytics',
              name: 'client-order-analytics',
              component: OrderAnalyticsView,
              meta: { bottomNav: 'orders' },
            },
            {
              path: 'reviews',
              name: 'client-order-reviews',
              component: OrderReviewsView,
              meta: { bottomNav: 'orders' },
            },
          ],
        },
        {
          path: 'menu',
          children: [
            {
              path: '',
              name: 'client-menu',
              component: MenuView,
              meta: { bottomNav: 'menu' },
            },
            {
              path: 'search',
              name: 'client-menu-search',
              component: MenuSearchView,
              meta: {
                bottomNav: 'menu',
                hideBottomNav: true,
                hideHeader: true,
              },
            },
            {
              path: 'categories',
              name: 'client-menu-categories',
              component: MenuCategoryListView,
              meta: { bottomNav: 'menu', hideBottomNav: true },
            },
            {
              path: 'categories/:categoryId',
              name: 'client-menu-category',
              component: MenuCategoryView,
              meta: { bottomNav: 'menu', hideBottomNav: true },
            },
            {
              path: 'items/new',
              name: 'client-menu-item-new',
              component: MenuDishView,
              meta: { bottomNav: 'menu', hideBottomNav: true },
            },
            {
              path: 'items/:itemId',
              name: 'client-menu-item',
              component: MenuDishView,
              meta: { bottomNav: 'menu', hideBottomNav: true },
            },
          ],
        },
      ],
    },
    // Admin template
    {
      path: '/admin',
      component: AdminLayout,
      redirect: { name: 'dashboard' },
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
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  syncTokenFromRoute(to, authStore)
  syncRestaurantIdFromRoute(to)

  const isAuthenticated = !!authStore.getAccessToken()
  const userRole = authStore.getUserRole()
  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthRoute = ['login', 'accessDenied', 'error', 'register'].includes(to.name)

  if (isAuthenticated && isAuthRoute) {
    next(getDefaultAuthenticatedRoute(authStore))
    return
  }

  if (isAuthenticated && userRole === 'restaurant_owner' && isAdminRoute) {
    next({ name: 'profile' })
    return
  }

  const managerAllowedRoutes = ['dashboard', 'orders']
  if (isAuthenticated && userRole === 'manager' && isAdminRoute && !isAuthRoute) {
    if (to.name && !managerAllowedRoutes.includes(to.name)) {
      next({ name: 'orders' })
      return
    }
  }

  if (!isAuthenticated && !isAuthRoute) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
