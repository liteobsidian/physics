<template>
    <v-card class="modern-card" rounded="lg" @click="navigateToTopic">
        <v-card-title class="pt-4 pb-2 px-4">
            <div class="topic-title">{{ topic.title }}</div>
        </v-card-title>

        <v-card-text class="px-4">
            <div v-if="tags.length > 0" class="mb-3 d-flex flex-wrap">
                <v-chip
                    v-for="tag in tags"
                    :key="tag.id"
                    size="small"
                    color="secondary"
                    class="mr-1 mb-1"
                    variant="flat"
                >
                    {{ tag.title }}
                </v-chip>
            </div>
            <v-progress-linear
                :model-value="getTopicProgress('study')"
                color="primary"
                height="20"
                rounded
                class="mb-2"
            >
                <template #default>
                    <strong>{{ Math.ceil(getTopicProgress('study')) }}%</strong>
                </template>
            </v-progress-linear>
        </v-card-text>

        <v-card-actions class="d-flex flex-wrap gap-2 justify-space-between px-4 pb-4">
            <template v-if="hasExercises">
                <v-btn
                    variant="outlined"
                    color="primary"
                    :prepend-icon="
                        getTopicProgress('study') < 100 && !hasAnyExerciseCompleted('exercise')
                            ? 'mdi-lock'
                            : 'mdi-pencil'
                    "
                    class="position-relative flex-grow-1"
                    style="min-width: 180px"
                    :disabled="getTopicProgress('study') < 100 && !hasAnyExerciseCompleted('exercise')"
                    rounded
                    @click.stop="navigateToTopicWithTab('exercise')"
                >
                    Упражнение
                    <template v-slot:append>
                        <v-icon v-if="getTopicProgress('exercise') === 100" color="success" size="24" class="ms-2">
                            mdi-check-circle
                        </v-icon>
                        <v-progress-circular
                            v-else-if="getTopicProgress('exercise') > 0"
                            :model-value="getTopicProgress('exercise')"
                            :size="24"
                            :width="3"
                            color="primary"
                            class="ms-2"
                        />
                    </template>
                </v-btn>

                <v-btn
                    variant="outlined"
                    color="secondary"
                    :prepend-icon="getTopicProgress('exercise') < 100 ? 'mdi-lock' : 'mdi-refresh'"
                    class="position-relative flex-grow-1"
                    style="min-width: 180px"
                    :disabled="getTopicProgress('exercise') < 100"
                    rounded
                    @click.stop="navigateToTopicWithTab('repetition')"
                >
                    Повторение
                    <template v-slot:append>
                        <v-icon v-if="getTopicProgress('repetition') === 100" color="success" size="24" class="ms-2">
                            mdi-check-circle
                        </v-icon>
                        <v-progress-circular
                            v-else-if="getTopicProgress('repetition') > 0"
                            :model-value="getTopicProgress('repetition')"
                            :size="24"
                            :width="3"
                            color="secondary"
                            class="ms-2"
                        />
                    </template>
                </v-btn>
            </template>

            <div v-else class="no-exercises-message d-flex align-center justify-center w-100">
                <v-icon color="grey-lighten-1" class="mr-2">mdi-information-outline</v-icon>
                <span class="text-body-2 text-grey-darken-1">Задания ещё не добавлены</span>
            </div>
        </v-card-actions>
    </v-card>
</template>

<script setup>
    import { defineProps, computed, ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import DataService from '../composables/dataService'

    const props = defineProps({
        topic: {
            type: Object,
            required: true,
        },
        tags: {
            type: Array,
            default: () => [],
        },
        progress: {
            type: Object,
            required: true,
        },
    })

    const router = useRouter()

    const checkExerciseData = ref([])
    const studyExerciseData = ref([])
    const repetitionExerciseData = ref([])

    const getData = async () => {
        try {
            const data = await DataService.getBulk({
                exercises: 'getExercises',
            })
            studyExerciseData.value = data.exercises.study
            checkExerciseData.value = data.exercises.check
            repetitionExerciseData.value = data.exercises.repetition
        } catch (e) {
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }

    // Проверяем, есть ли задания для темы
    const hasExercises = computed(() => {
        const topicId = props.topic.id
        const hasStudy = studyExerciseData.value.some(ex => ex.topic_id === topicId)
        const hasCheck = checkExerciseData.value.some(ex => ex.topic_id === topicId)
        const hasRepetition = repetitionExerciseData.value.some(ex => ex.topic_id === topicId)
        return hasStudy || hasCheck || hasRepetition
    })

    // Получаем прогресс конкретного типа для темы
    const getTopicProgress = type => {
        if (!props.progress || !props.progress.completed?.[type]) {
            return 0
        }

        // Используем вычисленное значение, переданное из родительского компонента
        return props.progress[type] || 0
    }

    // Проверяем, есть ли хотя бы одно выполненное задание в указанном типе
    const hasAnyExerciseCompleted = type => {
        if (!props.progress?.completed?.[type]) {
            return false
        }
        return Object.keys(props.progress.completed[type]).length > 0
    }

    // Навигация на страницу темы
    const navigateToTopic = () => {
        router.push(`/topic/${props.topic.id}`)
    }

    // Навигация на страницу темы с указанной вкладкой
    const navigateToTopicWithTab = tab => {
        router.push(`/topic/${props.topic.id}?tab=${tab}`)
    }

    onMounted(async () => {
        await getData()
    })
</script>

<style scoped>
    .topic-title {
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
        line-height: 1.4 !important;
        font-size: 1.1rem !important;
        font-weight: 500 !important;
        width: 100% !important;
        text-align: left !important;
        display: block !important;
    }

    .v-card-title {
        display: block !important;
        white-space: normal !important;
    }

    .v-card-actions {
        row-gap: 8px;
    }

    .modern-card {
        box-shadow:
            rgba(17, 17, 26, 0.05) 0px 4px 16px,
            rgba(17, 17, 26, 0.05) 0px 8px 32px;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .modern-card:hover {
        box-shadow:
            rgba(17, 17, 26, 0.1) 0px 8px 24px,
            rgba(17, 17, 26, 0.1) 0px 16px 56px;
    }

    .completed-progress {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(76, 175, 80, 0.1);
        border-radius: 6px;
        padding: 8px;
        height: 20px;
        color: var(--v-success-base, #4caf50);
    }

    .no-exercises-message {
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
        padding: 12px;
        min-height: 52px;
    }
</style>
