import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        if (originalRequest.url.includes('/user/get-complited-tasks')) {
            return Promise.reject(error)
        }
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await api.get('/auth/update-tokens')
                return api(originalRequest)
            } catch (error) {
                return Promise.reject(error)
            }
        } else if (error.response && error.response.status === 403) {
            window.location.href = 'http://localhost:5173/physics/#/login'
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

export default api
