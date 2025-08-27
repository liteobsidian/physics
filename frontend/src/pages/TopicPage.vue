<template>
    <div>
        <v-toolbar color="transparent" flat class="mb-3">
            <v-btn icon variant="text" color="primary" @click="$router.push('/')" :ripple="false">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="topic-header text-h6">{{ topicTitle }}</div>
        </v-toolbar>

        <div v-if="topicTags.length > 0" class="mb-4">
            <v-chip v-for="tag in topicTags" :key="tag" size="small" color="secondary" class="mr-1 mb-1" variant="flat">
                {{ tag }}
            </v-chip>
        </div>

        <v-tabs v-model="activeTab" color="primary" align-tabs="center" class="mb-4">
            <v-tab value="study">
                Изучение
                <template v-slot:append>
                    <v-icon v-if="getTopicProgress(topicId, 'study') === 100" size="20" color="success" class="ms-2">
                        mdi-check-circle
                    </v-icon>
                    <v-progress-circular
                        v-else-if="getTopicProgress(topicId, 'study') > 0"
                        :model-value="getTopicProgress(topicId, 'study')"
                        :size="20"
                        :width="2"
                        color="primary"
                        class="ms-2"
                    />
                </template>
            </v-tab>
            <v-tab
                value="exercise"
                :disabled="getTopicProgress(topicId, 'study') < 100 && !hasAnyExerciseCompleted(topicId, 'exercise')"
            >
                Упражнения
                <template v-slot:append>
                    <v-icon v-if="getTopicProgress(topicId, 'exercise') === 100" size="20" color="success" class="ms-2">
                        mdi-check-circle
                    </v-icon>
                    <v-progress-circular
                        v-else-if="getTopicProgress(topicId, 'exercise') > 0"
                        :model-value="getTopicProgress(topicId, 'exercise')"
                        :size="20"
                        :width="2"
                        color="primary"
                        class="ms-2"
                    />
                </template>
            </v-tab>
            <v-tab value="repetition">
                Повторение
                <template v-slot:append>
                    <v-icon
                        v-if="getTopicProgress(topicId, 'repetition') === 100"
                        size="20"
                        color="success"
                        class="ms-2"
                    >
                        mdi-check-circle
                    </v-icon>
                    <v-progress-circular
                        v-else-if="getTopicProgress(topicId, 'repetition') > 0"
                        :model-value="getTopicProgress(topicId, 'repetition')"
                        :size="20"
                        :width="2"
                        color="secondary"
                        class="ms-2"
                    />
                </template>
            </v-tab>
        </v-tabs>

        <v-progress-circular v-if="isLoading" indeterminate color="primary" size="48" class="d-flex mx-auto my-8" />
        <div v-else>
            <exercises-list
                v-if="activeTab === 'study'"
                :exercises="studyExercises"
                :progress-value="getTopicProgress(topicId, 'study')"
                :is-exercise-completed="exerciseId => isExerciseCompleted(topicId, 'study', exerciseId)"
                empty-message="Задания по изучению ещё не добавлены"
                @exercise-click="exercise => openExercise(exercise, 'study')"
            />
            <exercises-list
                v-else-if="activeTab === 'check'"
                :exercises="checkExercises"
                :progress-value="getTopicProgress(topicId, 'check')"
                :is-exercise-completed="exerciseId => isExerciseCompleted(topicId, 'check', exerciseId)"
                empty-message="Упражнения ещё не добавлены"
                @exercise-click="exercise => openExercise(exercise, 'check')"
            />

            <exercises-list
                v-else
                :exercises="repetitionExercises"
                :progress-value="getTopicProgress(topicId, 'repetition')"
                color="secondary"
                :is-exercise-completed="exerciseId => isExerciseCompleted(topicId, 'repetition', exerciseId)"
                empty-message="Задания для повторения ещё не добавлены"
                @exercise-click="exercise => openExercise(exercise, 'repetition')"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import ExercisesList from '../components/ExercisesList.vue'
    import { useProgress } from '../services/useProgress.service'
    import DataService from '../services/data.service'

    const route = useRoute()
    const router = useRouter()
    const topicId = computed(() => parseInt(route.params.id))
    const activeTab = ref('study')
    const checkExerciseData = ref([])
    const studyExerciseData = ref([])
    const repetitionExerciseData = ref([])
    const topicTagData = ref([])
    const tags = ref([])
    const isLoading = ref(false)

    // Используем композабл для работы с прогрессом
    const { getTopicProgress, hasAnyExerciseCompleted, isExerciseCompleted } = useProgress()

    const getData = async () => {
        try {
            const data = await DataService.getBulk({
                exercises: 'getExercises',
                topicsWithTags: 'getTopicsWithTags',
                tags: 'getTags',
            })
            topicTagData.value = data.topicsWithTags
            tags.value = data.tags
            checkExerciseData.value = data.exercises.check
            studyExerciseData.value = data.exercises.study
            repetitionExerciseData.value = data.exercises.repetition
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }

    // Получаем заголовок темы
    const topicTitle = computed(() => {
        const topic = topicTagData.value.find(t => t.id === topicId.value)
        return topic ? topic.title : 'Тема не найдена'
    })

    // Получаем задания для текущей темы
    const studyExercises = computed(() => {
        return studyExerciseData.value.filter(ex => ex.topic_id === topicId.value)
    })

    const checkExercises = computed(() => {
        return checkExerciseData.value.filter(ex => ex.topic_id === topicId.value)
    })

    const repetitionExercises = computed(() => {
        return repetitionExerciseData.value.filter(ex => ex.topic_id === topicId.value)
    })

    // Получаем теги темы
    const topicTags = computed(() => {
        const topic_tags = topicTagData.Tags || {}
        return topic_tags[topicId.value.toString()] || []
    })

    // Открываем задание
    const openExercise = (exercise, type) => {
        router.push(`/topic/${topicId.value}/${type}/exercise/${exercise.id}`)
    }

    // Следим за параметром tab в URL
    onMounted(async () => {
        // Убедимся, что прогресс загружен
        await getData()
        // Проверяем наличие параметра tab в URL
        const tabParam = route.query.tab
        if (tabParam && ['study', 'exercise', 'repetition'].includes(tabParam)) {
            // Проверяем, доступна ли вкладка для перехода
            if (
                tabParam === 'exercise' &&
                getTopicProgress(topicId.value, 'study') < 100 &&
                !hasAnyExerciseCompleted(topicId.value, 'exercise')
            ) {
                // Если вкладка недоступна, оставляем study
                activeTab.value = 'study'
            } else if (tabParam === 'repetition' && getTopicProgress(topicId.value, 'exercise') < 100) {
                // Если вкладка недоступна, проверяем, доступны ли упражнения
                if (
                    getTopicProgress(topicId.value, 'study') >= 100 ||
                    hasAnyExerciseCompleted(topicId.value, 'exercise')
                ) {
                    activeTab.value = 'exercise'
                } else {
                    activeTab.value = 'study'
                }
            } else {
                // Вкладка доступна, переходим на неё
                activeTab.value = tabParam
            }
        }
    })

    // Следим за изменением activeTab и обновляем URL
    watch(activeTab, newTab => {
        // Обновляем URL без перезагрузки страницы
        router.replace({
            path: `/topic/${topicId.value}`,
            query: { tab: newTab },
        })
    })
</script>

<style scoped>
    /* Улучшаем стили для адаптивных вкладок */
    :deep(.v-tab) {
        min-width: 100px;
        flex-wrap: nowrap;
    }

    :deep(.v-tabs) {
        flex-wrap: wrap;
    }

    :deep(.v-tabs .v-slide-group__container) {
        flex-wrap: wrap;
    }

    .topic-header {
        font-weight: 500;
        padding-left: 16px;
        flex: 1;
        white-space: normal;
        word-break: break-word;
    }
</style>
