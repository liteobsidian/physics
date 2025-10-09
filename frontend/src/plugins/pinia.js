import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import dataService, { getLatestVersion } from '@/services/data.service'
import { getCompletedTasks } from '@/services/api.service'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

export const userStorage = defineStore('user', {
    state: () => ({
        user_id: null,
        role: null,
        userProgress: [],
        created_at: null,
        days: null,
    }),
    actions: {
        async updateCompletedTask() {
            try {
                const res = await getCompletedTasks()
                this.userProgress = res.data
            } catch (error) {
                console.error(error)
                return
            }
        },
    },
    persist: true,
})

export const dataStorage = defineStore('exercises', {
    state: () => ({
        isloading: true,
        version: null,
        exercises: {
            study: [],
            check: [],
            repetition: [],
        },
        blocks: [],
        topics: [],
        tags: [],
        topicTag: [],
    }),
    actions: {
        async getData() {
            try {
                const ver = await getLatestVersion()
                if (this.version && this.version === ver.data.id && this.exercises.study?.length) return

                this.version = ver.data.id

                const data = await dataService.getBulk({
                    exercises: 'getExercises',
                    blocks: 'getBlocks',
                    topicsWithTags: 'getTopicsWithTags',
                    tags: 'getTags',
                    topics: 'getTopics',
                })
                this.version = ver.data.id
                this.exercises = {
                    study: data.exercises.study.data,
                    check: data.exercises.check.data,
                    repetition: data.exercises.repetition.data,
                }
                this.blocks = data.blocks.data
                this.topics = data.topics.data
                this.tags = data.tags.data
                this.topicTag = data.topicsWithTags.data
            } catch (error) {
                console.error(error)
                return
            } finally {
                this.isloading = false
            }
        },
    },
    persist: true,
})
