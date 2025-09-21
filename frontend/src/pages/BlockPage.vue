<template>
    <div class="mt-4">
        <div class="d-flex align-center mb-4">
            <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" @click="$router.push('/')">
                Назад к списку
            </v-btn>
        </div>

        <h1 class="text-h5 mb-6 text-wrap">{{ block?.title || 'Загрузка...' }}</h1>
        <v-progress-circular v-if="isReady" indeterminate color="primary" size="48" class="d-flex mx-auto my-8" />
        <div v-else-if="!block" class="text-center my-8">
            <v-icon icon="mdi-alert-circle" size="x-large" color="error" class="mb-2"></v-icon>
            <div class="text-h6 text-grey-darken-1">Блок не найден</div>
            <v-btn class="mt-4" color="primary" variant="outlined" @click="$router.push('/')">
                Вернуться на главную
            </v-btn>
        </div>

        <search-field v-model="searchQuery" />
        <v-progress-circular v-if="isReady" indeterminate color="primary" size="48" class="d-flex mx-auto my-8" />
        <div v-else-if="filteredTopics.length === 0" class="text-center my-8">
            <v-icon icon="mdi-magnify-off" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
            <div class="text-h6 text-grey-darken-1">Ничего не найдено</div>
            <div class="text-body-2 text-grey">Попробуйте изменить параметры поиска</div>
        </div>

        <v-row v-else>
            <v-col v-for="topic in filteredTopics" :key="topic.id" cols="12">
                <topic-card :topic="topic" :tags="getTopicTags(topic)" :progress="getTopicProgressObject(topic.id)" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import TopicCard from '../components/TopicCard.vue'
    import SearchField from '../components/SearchField.vue'
    import { useProgress } from '../services/useProgress.service'
    import { dataStorage } from '@/plugins/pinia'

    const store = dataStorage()

    const isReady = computed(() => store.isloading)

    const route = useRoute()
    const blockData = computed(() => store.blocks)
    const topicTagData = computed(() => store.topicTag)
    const searchQuery = ref('')
    // Используем композабл для работы с прогрессом
    const { getTopicProgress } = useProgress()

    // Блок
    const block = computed(() => {
        if (!blockData.value || !Array.isArray(blockData.value)) return null

        const id = Number(route.params.id)
        if (isNaN(id)) return null

        const found = blockData.value.find(b => b.id === id)
        return found ? { id: found.id, title: found.title } : null
    })
    console.log(typeof blockData)
    // Темы для текущего блока
    const blockTopics = computed(() => {
        if (!block.value || !topicTagData.value.length) {
            console.log('Нет данных: block.value =', blockData.value, 'topicsData.value =', topicTagData.value)
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
        // Вычисляем процент прогресса для всех типов заданий
        const result = {
            study: getTopicProgress(topicId, 'study'),
            exercise: getTopicProgress(topicId, 'exercise'),
            repetition: getTopicProgress(topicId, 'repetition'),
        }

        return result
    }

    // Получение объектов тегов для темы
    const getTopicTags = topic => (Array.isArray(topic.Tags) ? topic.Tags : [])
</script>
