import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // Не обрабатываем refresh для самого запроса на обновление токенов
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/update-tokens')
        ) {
            originalRequest._retry = true
            try {
                await api.get('/auth/update-tokens')
                return api(originalRequest)
            } catch (error) {
                window.location.href = 'http://localhost:5173/physics/#/login'
                return Promise.reject(error)
            }
        }

        // Если ошибка на самом refresh-запросе
        if (error.response?.status === 401 && originalRequest.url.includes('/auth/update-tokens')) {
            window.location.href = 'http://localhost:5173/physics/#/login'
            return Promise.reject(error)
        }

        // Любые другие 401 по деталям (можно оставить твой message check)
        if (
            error.response &&
            (error.response.data?.message === 'Unauthorized' || error.response.data?.message === 'Invalid token')
        ) {
            window.location.href = 'http://localhost:5173/physics/#/login'
            return Promise.reject(error)
        }

        return Promise.reject(error)
    },
)

export async function register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data
}

export async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response
}

export async function getUserInfo() {
    const response = await api.get('/user/userinfo')
    return response
}

export async function logOut() {
    const response = await api.delete('/auth/log-out')
    return response
}

export async function completeTask(exercise_id, exercise_type, topic_id) {
    return await api.post('/user/complete-task', { exercise_id, exercise_type, topic_id })
}

export async function getCompletedTasks() {
    const response = await api.get('/user/get-complited-tasks')
    return response
}

export async function changePassword(currentPassword, newPassword) {
    const response = await api.put('/user/change-password', { currentPassword, newPassword })
    return response
}

export default api
