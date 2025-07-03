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
    async getTags() {
        try {
            const result = await api.get('/data/tag-data')
            return result.data
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
    async getExercises() {
        try {
            const studyDataResult = await api.get('/data/studyexercise-data')
            const checkDataResult = await api.get('/data/checkexercise-data')
            const repetitionDataResult = await api.get('/data/repetitionexercise-data')
            return { study: studyDataResult.data, check: checkDataResult.data, repetition: repetitionDataResult.data }
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
}

export default new DataService()
