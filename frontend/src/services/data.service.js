import api from './api.service.js'

class DataService {
    async getBulk(requests) {
        const keys = Object.keys(requests)
        const results = await Promise.all(
            keys.map(k => {
                const def = requests[k]
                if (typeof def === 'string') {
                    return this[def]()
                } else if (typeof def === 'object' && def.method) {
                    return this[def.method](def.args)
                }
            }),
        )
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
            const tags = await api.get('/data/tag-data')
            return tags
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
    async getTopics(block_id) {
        try {
            const topics = await api.get('/data/topic-data', { block_id })
            return topics
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }
}

export default new DataService()
