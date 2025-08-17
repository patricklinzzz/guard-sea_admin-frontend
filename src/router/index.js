import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/navbar.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: '/new',
          name: 'newlist',
          component: () => import('@/views/New/NewListView.vue'),
        },
        {
          path: '/new/add',
          name: 'newadd',
          component: () => import('@/views/New/NewFormView.vue'),
        },
        {
          path: '/new/edit/:id',
          name: 'newedit',
          component: () => import('@/views/New/NewFormView.vue'),
        },
        {
          path: '/event',
          name: 'eventlist',
          component: () => import('@/views/event/EventListView.vue'),
        },
        {
          path: '/event/add',
          name: 'eventAdd',
          component: () => import('@/views/event/EventFormView.vue'),
        },
        {
          path: '/event/:id',
          name: 'eventEdit',
          component: () => import('@/views/event/EventFormView.vue'),
        },
        {
          path: '/event/:id/form',
          name: 'eventMember',
          component: () => import('@/views/event/EventMember.vue'),
          props: true,
        },
        {
          path: '/quiz/questions',
          name: 'quizQuestion',
          component: () => import('@/views/Quiz/QuizQuestionView.vue'),
        },
        {
          path: '/quiz/questions/add',
          name: 'q_add',
          component: () => import('@/views/Quiz/NewQuestionView.vue'),
        },
        {
          path: '/quiz/questions/edit/:id',
          name: 'q_edit',
          component: () => import('@/views/Quiz/NewQuestionView.vue'),
        },
        {
          path: '/quiz/categories',
          name: 'quizCategory',
          component: () => import('@/views/Quiz/QuizTypeView.vue'),
        },
        {
          path: 'members',
          name: 'MemberList',
          component: () => import('@/views/member/MemberList.vue'),
        },
        {
          path: '/product',
          name: 'productlist',
          component: () => import('@/views/Product/ProductListView.vue'),
        },
        {
          path: '/product/add',
          name: 'productadd',
          component: () => import('@/views/Product/ProductFormView.vue'),
        },
        {
          path: '/product/edit/:id',
          name: 'productedit',
          component: () => import('@/views/Product/ProductFormView.vue'),
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/Order/OrderListView.vue'),
        },
        {
          path: '/order/:id',
          name: 'orderdetail',
          component: () => import('@/views/Order/OrderDetailView.vue'),
        },
        {
          path: '/coupon',
          name: 'couponlist',
          component: () => import('@/views/Coupon/CouponListView.vue'),
        },
        {
          path: '/admin',
          name: 'adminlist',
          component: () => import('@/views/AdminPage/AdminListView.vue'),
        },
        {
          path: '/admin/add',
          name: 'adminadd',
          component: () => import('@/views/AdminPage/AddAdmin.vue'),
        },
        {
          path: '/admin/edit/:id',
          name: 'adminedit',
          component: () => import('@/views/AdminPage/EditAdmin.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },

    //404保持在最後一個 要加請加在上方↑↑
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404View.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
})

//全域導航守衛每次路由切換前都會觸發。用於檢查使用者的身份驗證狀態，並控制頁面存取權限

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.checkAuthStatus()
  }
  //路由需要驗證 (requiresAuth: true)，但使用者未登入
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // 使用者已登入，但試圖訪問僅限訪客的頁面 (guest: true)，例如登入頁
  else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
