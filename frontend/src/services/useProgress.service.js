import { ref, onMounted, onUnmounted } from 'vue'
import DataService from './data.service'
import { getCompletedTasks } from './api.service'

export function useProgress() {
    // Локальное состояние прогресса
    const progress = ref([])
    const checkExerciseData = ref([])
    const studyExerciseData = ref([])
    const repetitionExerciseData = ref([])

    const getData = async () => {
        try {
            const userProgress = JSON.parse(localStorage.getItem('userProgress') || '[]')
            progress.value = userProgress

            // console.log(userProgress.status)
            const data = await DataService.getBulk({
                exercises: 'getExercises',
            })

            studyExerciseData.value = data.exercises.study
            checkExerciseData.value = data.exercises.check
            repetitionExerciseData.value = data.exercises.repetition
        } catch (e) {
            console.warn('Доступ запрещён (401)')
            if (e.response?.status === 401) {
                return (progress.value = [])
            }
            console.error('Ошибка при загрузке данных:', e)
            throw e
        }
    }

    // Функция для расчета прогресса темы по типу
    const getTopicProgress = (topicId, type) => {
        let exercises = []
        if (type === 'study') {
            exercises = studyExerciseData.value.filter(ex => ex.topic_id === topicId)
        } else if (type === 'check') {
            exercises = checkExerciseData.value.filter(ex => ex.topic_id === topicId)
        } else if (type === 'repetition') {
            exercises = repetitionExerciseData.value.filter(ex => ex.topic_id === topicId)
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

        // Теперь считаем все задания по всем темам
        totalExercises +=
            studyExerciseData.value.length + checkExerciseData.value.length + repetitionExerciseData.value.length
        // Считаем решенные задания из progress
        totalSolved = progress.value.length

        return totalExercises > 0 ? Number(((totalSolved / totalExercises) * 100).toFixed(2)) : 0
    }

    // Автоматически загружаем прогресс при монтировании компонента
    onMounted(async () => {
        await getData()
        // Слушаем событие обновления прогресса
        window.addEventListener('exercise-completed', getData)
    })

    // Удаляем слушатель при размонтировании компонента
    onUnmounted(() => {
        window.removeEventListener('exercise-completed', getData)
    })

    // Экспортируем все необходимые функции и состояния
    return {
        progress,
        getTopicProgress,
        hasAnyExerciseCompleted,
        isExerciseCompleted,
        markExerciseAsCompleted,
        calculateTotalProgress,
        checkExerciseData,
        studyExerciseData,
        repetitionExerciseData,
    }
}
