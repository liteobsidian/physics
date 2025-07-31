<template>
    <div class="mt-4">
        <div class="d-flex align-center mb-4">
            <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" @click="$router.push('/')">
                Назад к списку
            </v-btn>
        </div>

        <h1 class="text-h5 mb-6 text-wrap">{{ block?.title || 'Загрузка...' }}</h1>

        <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="!block" class="text-center my-8">
            <v-icon icon="mdi-alert-circle" size="x-large" color="error" class="mb-2"></v-icon>
            <div class="text-h6 text-grey-darken-1">Блок не найден</div>
            <v-btn class="mt-4" color="primary" variant="outlined" @click="$router.push('/')">
                Вернуться на главную
            </v-btn>
        </div>

        <template v-else>
            <search-field v-model="searchQuery" />

            <div v-if="filteredTopics.length === 0" class="text-center my-8">
                <v-icon icon="mdi-magnify-off" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
                <div class="text-h6 text-grey-darken-1">Ничего не найдено</div>
                <div class="text-body-2 text-grey">Попробуйте изменить параметры поиска</div>
            </div>

            <v-row v-else>
                <v-col v-for="topic in filteredTopics" :key="topic.id" cols="12">
                    <topic-card
                        :topic="topic"
                        :tags="getTopicTags(topic)"
                        :progress="getTopicProgressObject(topic.id)"
                    />
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import TopicCard from '../components/TopicCard.vue'
    import SearchField from '../components/SearchField.vue'
    import { useProgress } from '../services/useProgress.service'
    import DataService from '../services/data.service'

    const route = useRoute()
    const blockData = ref(null)
    const topicTagData = ref(null)
    const loading = ref(true)
    const searchQuery = ref('')

    // Используем композабл для работы с прогрессом
    const { progress: topicsProgress, getTopicProgress } = useProgress()

    const getData = async () => {
        try {
            const data = await DataService.getBulk({
                blocks: 'getBlocks',
                topicsWithTags: 'getTopicsWithTags',
            })
            blockData.value = data.blocks
            topicTagData.value = data.topicsWithTags
            // console.log(data.blocks)
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }

    // Блок
    const block = computed(() => {
        if (!blockData.value || !Array.isArray(blockData.value)) return null

        const id = Number(route.params.id)
        if (isNaN(id)) return null

        const found = blockData.value.find(b => b.id === id)
        return found ? { id: found.id, title: found.title } : null
    })

    // Темы для текущего блока
    const blockTopics = computed(() => {
        if (!block.value || !topicTagData.value.length) {
            console.log('Нет данных: block.value =', block.value, 'topicsData.value =', topicTagData.value)
            return []
        }

        const filtered = topicTagData.value.filter(topic => topic.block_id === block.value.id)

        return filtered
    })

    // Отфильтрованные темы с учетом поиска
    const filteredTopics = computed(() => {
        if (!searchQuery.value) return blockTopics.value

        const query = searchQuery.value.toLowerCase()
        return blockTopics.value.filter(topic => topic.title.toLowerCase().includes(query))
    })

    // Получаем объект прогресса для топика
    const getTopicProgressObject = topicId => {
        const progress = topicsProgress.value[topicId]
        if (!progress) {
            return {
                completed: {
                    study: {},
                    exercise: {},
                    repetition: {},
                },
            }
        }

        // Вычисляем процент прогресса для всех типов заданий
        const result = {
            ...progress,
            study: getTopicProgress(topicId, 'study'),
            exercise: getTopicProgress(topicId, 'exercise'),
            repetition: getTopicProgress(topicId, 'repetition'),
        }

        return result
    }

    // Получение объектов тегов для темы
    const getTopicTags = topic => (Array.isArray(topic.Tags) ? topic.Tags : [])

    // Инициализация
    onMounted(async () => {
        loading.value = true
        try {
            await getData()
        } catch (e) {
            console.error('Failed to load data', e)
        } finally {
            loading.value = false
        }
    })
</script>
