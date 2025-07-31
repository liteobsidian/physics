import { ref, onMounted, onUnmounted } from 'vue'
import DataService from './data.service'

export function useProgress() {
    // Локальное состояние прогресса
    const progress = ref({})
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

    // Загрузка прогресса из localStorage
    const loadProgress = () => {
        const progressData = localStorage.getItem('topicsProgress')
        progress.value = progressData ? JSON.parse(progressData) : {}

        // Инициализация, если прогресс не найден
        if (!progressData) {
            localStorage.setItem('topicsProgress', JSON.stringify({}))
        }
    }

    // Сохранение прогресса в localStorage
    const saveProgress = () => {
        localStorage.setItem('topicsProgress', JSON.stringify(progress.value))
    }

    // Функция для расчета прогресса темы по типу
    const getTopicProgress = (topicId, type) => {
        const topicProgress = progress.value[topicId]
        if (!topicProgress || topicProgress.completed?.[type] === undefined) {
            return 0
        }

        let totalExercises = 0
        let completedExercises = 0

        if (type === 'study') {
            // Для изучения используем количество выполненных заданий из массива study_exercises
            const exercises = studyExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises = exercises.length
            completedExercises = Object.keys(topicProgress.completed.study || {}).length
        } else if (type === 'exercise') {
            // Для упражнений используем количество выполненных заданий из массива check_exercises
            const exercises = checkExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises = exercises.length
            completedExercises = Object.keys(topicProgress.completed.exercise || {}).length
        } else if (type === 'repetition') {
            // Для повторения используем количество выполненных заданий из массива repetition_exercises
            const exercises = repetitionExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises = exercises.length
            completedExercises = Object.keys(topicProgress.completed.repetition || {}).length
        }

        return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0
    }

    // Функция для проверки наличия хотя бы одного выполненного задания
    const hasAnyExerciseCompleted = (topicId, type) => {
        if (!progress.value[topicId]?.completed?.[type]) {
            return false
        }
        return Object.keys(progress.value[topicId].completed[type]).length > 0
    }

    // Функция для проверки, выполнено ли задание
    const isExerciseCompleted = (topicId, type, exerciseId) => {
        if (!progress.value[topicId]?.completed?.[type]) {
            return false
        }
        return !!progress.value[topicId].completed[type][exerciseId]
    }

    // Функция для отметки задания как выполненного
    const markExerciseAsCompleted = (topicId, type, exerciseId) => {
        // Инициализируем структуру, если необходимо
        if (!progress.value[topicId]) {
            progress.value[topicId] = {
                completed: {
                    study: {},
                    exercise: {},
                    repetition: {},
                },
            }
        } else if (!progress.value[topicId].completed) {
            progress.value[topicId].completed = {
                study: {},
                exercise: {},
                repetition: {},
            }
        }

        // Отмечаем задание как выполненное
        if (!progress.value[topicId].completed[type]) {
            progress.value[topicId].completed[type] = {}
        }

        progress.value[topicId].completed[type][exerciseId] = true

        // Сохраняем прогресс
        saveProgress()

        // Вызываем событие обновления прогресса
        window.dispatchEvent(new CustomEvent('exercise-completed'))
    }

    // Функция для расчета общего прогресса
    const calculateTotalProgress = () => {
        let totalSolved = 0
        let totalExercises = 0

        // Сначала подсчитаем общее количество заданий по всем темам, независимо от прогресса
        // Найдем все уникальные идентификаторы тем
        const allTopicIds = new Set()

        // Добавляем идентификаторы тем из всех типов заданий
        studyExerciseData.value.forEach(ex => allTopicIds.add(ex.topic_id))
        checkExerciseData.value.forEach(ex => allTopicIds.add(ex.topic_id))
        repetitionExerciseData.value.forEach(ex => allTopicIds.add(ex.topic_id))

        // Теперь считаем все задания по всем темам
        allTopicIds.forEach(topicId => {
            // Считаем задания из study_exercises
            const studyExercises = studyExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises += studyExercises.length

            // Считаем задания из check_exercises
            const checkExercises = checkExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises += checkExercises.length

            // Считаем задания из repetition_exercises
            const repetitionExercises = repetitionExerciseData.value.filter(ex => ex.topic_id === topicId)
            totalExercises += repetitionExercises.length
        })

        // Считаем решенные задания из progress
        Object.keys(progress.value).forEach(topicId => {
            const topicProgress = progress.value[topicId]

            // Считаем решенные задания
            if (topicProgress.completed) {
                if (topicProgress.completed.study) {
                    totalSolved += Object.keys(topicProgress.completed.study).length
                }
                if (topicProgress.completed.exercise) {
                    totalSolved += Object.keys(topicProgress.completed.exercise).length
                }
                if (topicProgress.completed.repetition) {
                    totalSolved += Object.keys(topicProgress.completed.repetition).length
                }
            }
        })

        return totalExercises > 0 ? Math.round((totalSolved / totalExercises) * 100) : 0
    }

    // Функция обновления прогресса
    const updateProgress = () => {
        // Прогресс пересчитается автоматически благодаря computed свойствам
        // Нам нужно только перезагрузить данные
        loadProgress()
    }

    // Автоматически загружаем прогресс при монтировании компонента
    onMounted(async () => {
        loadProgress()
        await getData()
        // Слушаем событие обновления прогресса
        window.addEventListener('exercise-completed', updateProgress)
    })

    // Удаляем слушатель при размонтировании компонента
    onUnmounted(() => {
        window.removeEventListener('exercise-completed', updateProgress)
    })

    // Экспортируем все необходимые функции и состояния
    return {
        progress,
        getTopicProgress,
        hasAnyExerciseCompleted,
        isExerciseCompleted,
        markExerciseAsCompleted,
        calculateTotalProgress,
        updateProgress,
        loadProgress,
        saveProgress,
        checkExerciseData,
        studyExerciseData,
        repetitionExerciseData,
    }
}
