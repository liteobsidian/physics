import api from './api.service'

export async function register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data
}
