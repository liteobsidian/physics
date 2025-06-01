import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ErrorLayout from '../layouts/ErrorLayout.vue'
import MainPage from '../pages/MainPage.vue'
import TopicPage from '../pages/TopicPage.vue'
import BlockPage from '../pages/BlockPage.vue'
import ExercisePage from '../pages/ExercisePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

// Определяем базовый URL в зависимости от окружения
const base = import.meta.env.BASE_URL || '/physics/'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'main',
        component: MainPage,
      },
      {
        path: 'block/:id',
        name: 'block',
        component: BlockPage,
        props: true,
      },
      {
        path: 'topic/:id',
        name: 'topic',
        component: TopicPage,
        props: true,
      },
      {
        path: 'topic/:topicId/:type/exercise/:exerciseId',
        name: 'exercise',
        component: ExercisePage,
        props: true,
      },
    ],
  },
  {
    path: '/',
    component: ErrorLayout,
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior() {
    // Всегда прокручивать в начало страницы при смене маршрута
    return { top: 0 }
  },
})

// Обработка перенаправлений с 404.html
router.beforeEach((to, from, next) => {
  // Если есть параметр p в URL, значит это перенаправление с 404.html
  const redirectParam = new URLSearchParams(window.location.search).get('p')

  if (redirectParam && to.fullPath === '/') {
    // Очищаем URL от параметров перенаправления
    const cleanPath = redirectParam.replace(/~and~/g, '&')
    // Перенаправляем на нужный маршрут
    next({ path: cleanPath, replace: true })
  } else {
    next()
  }
})

export default router
