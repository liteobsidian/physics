import { ref, onMounted, onUnmounted } from 'vue'
import exercisesData from '../data/exercises.json'

export function useProgress() {
  // Локальное состояние прогресса
  const progress = ref({})

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
      const exercises = exercisesData.study_exercises.filter(ex => ex.topic_id === topicId)
      totalExercises = exercises.length
      completedExercises = Object.keys(topicProgress.completed.study || {}).length
    } else if (type === 'exercise') {
      // Для упражнений используем количество выполненных заданий из массива check_exercises
      const exercises = exercisesData.check_exercises.filter(ex => ex.topic_id === topicId)
      totalExercises = exercises.length
      completedExercises = Object.keys(topicProgress.completed.exercise || {}).length
    } else if (type === 'repetition') {
      // Для повторения используем количество выполненных заданий из массива repetition_exercises
      const exercises = exercisesData.repetition_exercises.filter(ex => ex.topic_id === topicId)
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
    if (Object.keys(progress.value).length === 0) return 0

    let totalSolved = 0
    let totalExercises = 0

    // Подсчет общего количества заданий и решенных заданий
    Object.keys(progress.value).forEach(topicId => {
      const numericTopicId = parseInt(topicId)
      const topicProgress = progress.value[topicId]

      // Считаем задания из study_exercises
      const studyExercises = exercisesData.study_exercises.filter(
        ex => ex.topic_id === numericTopicId,
      )
      totalExercises += studyExercises.length

      // Считаем задания из check_exercises
      const checkExercises = exercisesData.check_exercises.filter(
        ex => ex.topic_id === numericTopicId,
      )
      totalExercises += checkExercises.length

      // Считаем задания из repetition_exercises
      const repetitionExercises = exercisesData.repetition_exercises.filter(
        ex => ex.topic_id === numericTopicId,
      )
      totalExercises += repetitionExercises.length

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
  onMounted(() => {
    loadProgress()
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
  }
}
