import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ErrorLayout from '../layouts/ErrorLayout.vue'
import MainPage from '../pages/MainPage.vue'
import TopicPage from '../pages/TopicPage.vue'
import BlockPage from '../pages/BlockPage.vue'
import ExercisePage from '../pages/ExercisePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
