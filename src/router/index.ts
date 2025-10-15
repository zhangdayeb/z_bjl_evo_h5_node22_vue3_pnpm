import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'h5-root',
      component: () => import('@/views/h5/Game.vue'),
      meta: { platform: 'h5' }
    },
    {
      path: '/h5',
      name: 'h5',
      component: () => import('@/views/h5/Game.vue'),
      meta: { platform: 'h5' }
    },
    {
      path: '/pc',
      name: 'pc',
      component: () => import('@/views/pc/Game.vue'),
      meta: { platform: 'pc' }
    }
  ]
})

export default router
