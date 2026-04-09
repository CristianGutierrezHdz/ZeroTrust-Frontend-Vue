import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DiagnosticView from '@/views/DiagnosticView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/diagnostic',
      name: 'diagnostic',
      component: DiagnosticView,
    },
  ],
})

export default router
