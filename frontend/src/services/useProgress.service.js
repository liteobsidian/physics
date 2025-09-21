import { ref, onMounted, onUnmounted, computed } from 'vue'
import DataService, { getLatestVersion } from './data.service'
import { dataStorage, userStorage } from '@/plugins/pinia'

export function useProgress() {
    const dataStore = dataStorage()
    const store = userStorage()
    const progress = computed(() => store.userProgress)

    // Функция для расчета прогресса темы по типу
    const getTopicProgress = (topicId, type) => {
        let exercises = []
        if (type === 'study') {
            exercises = Array.isArray(dataStore.exercises.study)
                ? dataStore.exercises.study.filter(ex => ex.topic_id === topicId)
                : []
        } else if (type === 'check') {
            exercises = Array.isArray(dataStore.exercises.study)
                ? dataStore.exercises.check.filter(ex => ex.topic_id === topicId)
                : []
        } else if (type === 'repetition') {
            exercises = Array.isArray(dataStore.exercises.study)
                ? dataStore.exercises.repetition.filter(ex => ex.topic_id === topicId)
                : []
        }

        const totalExercises = exercises.length

        const completedExercises = progress.value.filter(
            item => item.topic_id === topicId && item.exercise_type === type,
        ).length

        return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0
    }
    // Функция для проверки наличия хотя бы одного выполненного задания

    const hasAnyExerciseCompleted = (topicId, type) => {
        return progress.value.some(item => item.topic_id === topicId && item.exercise_type === type)
    }

    // Функция для проверки, выполнено ли задание
    const isExerciseCompleted = (topicId, type, exerciseId) => {
        return progress.value.some(
            item => item.topic_id === topicId && item.exercise_type === type && item.exercise_id === exerciseId,
        )
    }

    // Функция для отметки задания как выполненного
    const markExerciseAsCompleted = (topicId, type, exerciseId) => {
        if (
            !progress.value.some(
                item => item.topic_id === topicId && item.exercise_type === type && item.exercise_id === exerciseId,
            )
        ) {
            progress.value.push({
                topic_id: topicId,
                exercise_type: type,
                exercise_id: exerciseId,
            })
            window.dispatchEvent(new CustomEvent('exercise-completed'))
        }
    }

    // Функция для расчета общего прогресса
    const calculateTotalProgress = () => {
        let totalSolved = 0
        let totalExercises = 0

        const studyLen = Array.isArray(dataStore.exercises.study) ? dataStore.exercises.study.length : []
        const checkLen = Array.isArray(dataStore.exercises.check) ? dataStore.exercises.check.length : []
        const repetitionLen = Array.isArray(dataStore.exercises.repetition) ? dataStore.exercises.repetition.length : []
        totalExercises = studyLen + checkLen + repetitionLen
        totalSolved = progress.value?.length

        return totalExercises > 0 ? Number(((totalSolved / totalExercises) * 100).toFixed(2)) : 0
    }

    // Автоматически загружаем прогресс при монтировании компонента
    // onMounted(async () => {
    //     // Слушаем событие обновления прогресса
    //     window.addEventListener('exercise-completed')
    // })

    // // Удаляем слушатель при размонтировании компонента
    // onUnmounted(() => {
    //     window.removeEventListener('exercise-completed')
    // })

    // Экспортируем все необходимые функции и состояния
    return {
        progress,
        getTopicProgress,
        hasAnyExerciseCompleted,
        isExerciseCompleted,
        markExerciseAsCompleted,
        calculateTotalProgress,
    }
}
