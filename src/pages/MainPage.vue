<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      label="Поиск"
      prepend-inner-icon="mdi-magnify"
      class="mb-4 search-field"
      single-line
      hide-details="auto"
      clearable
      rounded
      density="compact"
      bg-color="grey-lighten-4"
      @click:clear="clearSearch"
    ></v-text-field>

    <v-chip-group v-model="selectedTags" multiple class="mb-4">
      <v-chip
        v-for="tag in availableTags"
        :key="tag"
        filter
        variant="outlined"
        color="primary"
      >
        {{ tag }}
      </v-chip>
    </v-chip-group>

    <v-row>
      <v-col
        v-for="topic in filteredTopics"
        :key="topic.id"
        cols="12"
      >
        <v-card class="modern-card" rounded="lg">
          <v-card-title class="pt-4 pb-2 px-4">
            <div class="topic-title">{{ topic.title }}</div>
          </v-card-title>
          
          <v-card-text class="px-4">
            <div v-if="getTopicTags(topic.id).length > 0" class="mb-3">
              <v-chip
                v-for="tag in getTopicTags(topic.id)"
                :key="tag"
                size="small"
                color="secondary"
                class="mr-1 mb-1"
                variant="flat"
              >
                {{ tag }}
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="getTopicProgress(topic.id, 'study')"
              color="primary"
              height="20"
              rounded
              class="mb-2"
            >
              <template #default>
                <strong>{{ Math.ceil(getTopicProgress(topic.id, 'study')) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between px-4 pb-4">
            <v-btn
              variant="outlined"
              color="primary"
              :prepend-icon="getTopicProgress(topic.id, 'study') < 100 ? 'mdi-lock' : 'mdi-pencil'"
              class="position-relative"
              :disabled="getTopicProgress(topic.id, 'study') < 100"
              width="45%"
              rounded
            >
              Упражнение
              <v-progress-circular
                v-if="getTopicProgress(topic.id, 'exercise') > 0"
                :model-value="getTopicProgress(topic.id, 'exercise')"
                :size="24"
                :width="3"
                color="primary"
                class="progress-indicator"
              >
              </v-progress-circular>
            </v-btn>
            
            <v-btn
              variant="outlined"
              color="secondary"
              :prepend-icon="getTopicProgress(topic.id, 'exercise') < 100 ? 'mdi-lock' : 'mdi-refresh'"
              class="position-relative"
              :disabled="getTopicProgress(topic.id, 'exercise') < 100"
              width="45%"
              rounded
            >
              Повторение
              <v-progress-circular
                v-if="getTopicProgress(topic.id, 'repetition') > 0"
                :model-value="getTopicProgress(topic.id, 'repetition')"
                :size="24"
                :width="3"
                color="secondary"
                class="progress-indicator"
              >
              </v-progress-circular>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import topicsData from '../data/topics.json'
import tagsData from '../data/tags.json'

const searchQuery = ref('')
const selectedTags = ref([])
const availableTags = tagsData.available_tags
const topic_tags = tagsData.topic_tags
const topicsProgress = ref({})

// Очистка поиска
const clearSearch = () => {
  searchQuery.value = ''
}

// Получаем прогресс из localStorage
const getProgressFromLocalStorage = () => {
  const progressData = localStorage.getItem('topicsProgress')
  return progressData ? JSON.parse(progressData) : {}
}

// Получаем прогресс конкретной темы и типа (study, exercise, repetition)
const getTopicProgress = (topicId, type) => {
  const progress = topicsProgress.value[topicId]
  if (!progress || progress[type] === undefined) return 0
  return progress[type]
}

// Сохраняем прогресс в localStorage
const saveProgressToLocalStorage = () => {
  localStorage.setItem('topicsProgress', JSON.stringify(topicsProgress.value))
}

// Инициализируем прогресс по умолчанию
const initializeProgress = () => {
  const savedProgress = getProgressFromLocalStorage()
  topicsProgress.value = savedProgress
  
  // Инициализируем все темы если нет записей
  topicsData.topics.forEach(topic => {
    if (!topicsProgress.value[topic.id]) {
      topicsProgress.value[topic.id] = {
        study: 0,
        exercise: 0,
        repetition: 0
      }
    }
  })
  
  saveProgressToLocalStorage()
}

onMounted(() => {
  initializeProgress()
})

const getTopicTags = (topicId) => {
  return topic_tags[topicId.toString()] || []
}

const filteredTopics = computed(() => {
  return topicsData.topics.filter(topic => {
    // Добавляем проверку на null и undefined
    const query = searchQuery.value || ''
    const matchesSearch = topic.title.toLowerCase().includes(query.toLowerCase())
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.some(tag => getTopicTags(topic.id).includes(tag))
    return matchesSearch && matchesTags
  })
})
</script>

<style scoped>
.search-field :deep(.v-field__outline) {
  opacity: 0 !important;
}

.progress-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

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

.modern-card {
  box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.modern-card:hover {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
}
</style> 