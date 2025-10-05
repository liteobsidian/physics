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
import ChangePasswordPage from '../pages/ChangePasswordPage.vue'
import api from '@/services/api.service'
import AdminEditorPage from '@/pages/AdminEditorPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ForbiddenPage from '@/pages/ForbiddenPage.vue'
import EmailSendPage from '@/pages/EmailSendPage.vue'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.vue'
import { userStorage } from '@/plugins/pinia'

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
                path: '/profile/:id',
                component: ProfilePage,
                props: true,
                meta: { requiresAuth: true },
            },
            {
                path: '/change-password',
                name: 'change-password',
                component: ChangePasswordPage,
                meta: { requiresAuth: true },
            },
            {
                path: '/add-admin',
                name: 'add-admin',
                component: AdminPage,
                meta: { requiresAuth: true, requiresAdmin: true },
            },
            {
                path: '/emailsendedpage',
                name: 'email-send',
                component: EmailSendPage,
            },
            {
                path: '/forgotpassword',
                name: 'forgot-password',
                component: ForgotPasswordPage,
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
            {
                path: '/forbidden',
                name: 'forbidden',
                component: ForbiddenPage,
            },
        ],
    },
    {
        path: '/editor',
        name: 'editor',
        component: AdminEditorPage,
        meta: { requiresAuth: true, requiresAdmin: true },
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

router.beforeEach(async (to, from, next) => {
    const store = userStorage()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            await api.get('/auth/update-tokens')
        } catch {
            next({ name: 'login' })
        }
    }

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store.role !== 'admin') {
            next({ name: 'forbidden' })
            return
        }
    }

    next()
})

export default router
