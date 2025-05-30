import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import MainPage from '@/pages/MainPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'main',
        component: MainPage
      }
    ]
  },
  {
    path: '/',
    component: ErrorLayout,
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
