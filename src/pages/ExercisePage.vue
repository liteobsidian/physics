<template>
  <div>
    <v-toolbar color="transparent" flat class="mb-3">
      <v-btn icon variant="text" color="primary" @click="goBack" :ripple="false">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="exercise-header text-h6">Задание {{ exercise?.id }}</div>
    </v-toolbar>

    <v-card v-if="exercise" class="pa-4 mb-4" rounded="lg">
      <!-- Задание с изображением -->
      <div v-if="isImageTask(exercise.task)" class="text-center mb-4">
        <v-img :src="getImagePath(exercise.task)" max-width="100%" contain class="mx-auto"></v-img>
      </div>
      <!-- Задание с HTML -->
      <div v-else class="text-body-1 mb-4 task-text" v-html="exercise.task"></div>

      <v-expansion-panels v-if="exercise.hint" class="mb-4 hint-panel">
        <v-expansion-panel density="compact" class="hint-panel-outline" elevation="0">
          <v-expansion-panel-title>
            <v-icon size="small" color="amber-darken-2" class="me-2">mdi-lightbulb-outline</v-icon>
            <span class="text-body-2">Подсказка</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="text-body-2">
            <!-- Подсказка с изображением -->
            <div v-if="isImageTask(exercise.hint)" class="text-center">
              <v-img
                :src="getImagePath(exercise.hint)"
                max-width="100%"
                contain
                class="mx-auto"
              ></v-img>
            </div>
            <!-- Подсказка с HTML -->
            <div v-else v-html="exercise.hint"></div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-text-field
        v-model="userAnswer"
        label="Ваш ответ"
        variant="outlined"
        hide-details="auto"
        class="mt-4"
        :error="showError"
        :error-messages="showError ? 'Неверный ответ. Попробуйте ещё раз.' : ''"
      ></v-text-field>

      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" variant="elevated" @click="checkAnswer"> Проверить </v-btn>
      </div>
    </v-card>

    <!-- Сообщение об успехе -->
    <v-snackbar v-model="successSnackbar" color="success" timeout="2000" location="top">
      Правильно! 🎉
    </v-snackbar>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import exercisesData from '../data/exercises.json'
  import { useProgress } from '../composables/useProgress'

  const route = useRoute()
  const router = useRouter()

  const topicId = computed(() => parseInt(route.params.topicId))
  const exerciseId = computed(() => parseInt(route.params.exerciseId))
  const exerciseType = computed(() => route.params.type)

  const userAnswer = ref('')
  const showError = ref(false)
  const successSnackbar = ref(false)

  // Используем композабл для работы с прогрессом
  const { markExerciseAsCompleted } = useProgress()

  // Получаем данные задания
  const exercise = computed(() => {
    if (!topicId.value || !exerciseId.value || !exerciseType.value) {
      return null
    }

    const exercises = getExercisesByType(exerciseType.value)
    return exercises.find(ex => ex.topic_id === topicId.value && ex.id === exerciseId.value) || null
  })

  // Получаем задания по типу
  const getExercisesByType = type => {
    if (type === 'study') {
      return exercisesData.study_exercises
    } else if (type === 'exercise') {
      return exercisesData.check_exercises
    } else if (type === 'repetition') {
      return exercisesData.repetition_exercises
    }
    return []
  }

  // Функция для проверки, является ли задание изображением
  const isImageTask = text => {
    if (!text) return false
    return typeof text === 'string' && text.startsWith('img')
  }

  // Функция для извлечения пути к изображению
  const getImagePath = text => {
    if (!isImageTask(text)) return ''

    // Находим имя файла (без возможных расширений)
    const imgBaseName = text.split('.').length > 1 ? text : `${text}`

    // Для задания 1.1.1.11 принудительно используем PNG
    if (imgBaseName === 'img.1.1.1.11') {
      return `${import.meta.env.BASE_URL}img/${imgBaseName}.png`
    }

    // Для остальных используем .jpeg
    return `${import.meta.env.BASE_URL}img/${imgBaseName}.jpeg`
  }

  // Проверяем ответ
  const checkAnswer = () => {
    if (!exercise.value) return

    const isCorrect = userAnswer.value.trim().toLowerCase() === exercise.value.answer.toLowerCase()

    if (isCorrect) {
      // Отмечаем задание как выполненное
      markExerciseAsCompleted(topicId.value, exerciseType.value, exerciseId.value)

      // Показываем сообщение об успехе
      successSnackbar.value = true

      // Возвращаемся на страницу темы через 1.5 секунды
      setTimeout(() => {
        goBack()
      }, 1500)
    } else {
      showError.value = true
    }
  }

  // Возвращаемся на предыдущую страницу
  const goBack = () => {
    router.push(`/topic/${topicId.value}?tab=${exerciseType.value}`)
  }

  onMounted(() => {
    // Сбрасываем поля при загрузке страницы
    userAnswer.value = ''
    showError.value = false
  })
</script>

<style scoped>
  .exercise-header {
    font-weight: 500;
    padding-left: 16px;
    flex: 1;
    white-space: normal;
    word-break: break-word;
  }

  .task-text {
    white-space: normal;
    word-break: break-word;
    max-width: 100%;
  }

  /* Стили для вложенных элементов в HTML-контенте */
  :deep(img) {
    max-width: 100%;
  }
  :deep(ol),
  :deep(ul) {
    padding-left: 24px;
  }

  .hint-panel {
    max-width: 100%;
  }

  .hint-panel-outline {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
  }

  :deep(.v-expansion-panel-title) {
    padding: 8px 16px !important;
    min-height: auto !important;
  }

  :deep(.v-expansion-panel-text__wrapper) {
    padding: 0 16px 16px 16px !important;
  }

  .debug-info {
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    color: #333;
  }
</style>
