import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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

export default router
