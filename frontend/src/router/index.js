import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ErrorLayout from '../layouts/ErrorLayout.vue'
import MainPage from '../pages/MainPage.vue'
import TopicPage from '../pages/TopicPage.vue'
import BlockPage from '../pages/BlockPage.vue'
import ExercisePage from '../pages/ExercisePage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

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
            {
                path: '/register',
                name: 'register',
                component: RegisterPage,
            },
            {
                path: '/login',
                name: 'login',
                component: LoginPage,
            },
            {
                path: '/profile',
                name: 'profile',
                component: ProfilePage,
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
    history: createWebHashHistory(base),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const el = document.querySelector(to.hash)
                    if (el) resolve({ el })
                    else resolve({ top: 0 })
                }, 50)
            })
        }
        return savedPosition || { top: 0 }
    },
})

export default router
