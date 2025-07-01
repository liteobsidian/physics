import api from './api.js'

class DataService {
    async getBulk(requests) {
        const keys = Object.keys(requests)
        const results = await Promise.all(keys.map(k => this[requests[k]]()))
        return keys.reduce((acc, key, idx) => ({ ...acc, [key]: results[idx] }), {})
    }
    async getBlocks() {
        try {
            const result = await api.get('/data/block-data')
            return result.data
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
    async getTopicsWithTags() {
        try {
            const result = await api.get('/data/topics-with-tags')
            return result.data
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
    async getTags(){
        try {
            const result = await api.get('/data/tag-data')
            return result.data
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
}

export default new DataService()
