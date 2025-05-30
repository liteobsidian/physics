<template>
  <div class="mt-4">
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

    <div class="d-flex align-center">
      <span class="text-subtitle-2 mr-2">Фильтр по тегам:</span>
      <v-btn
        v-if="selectedTags.length > 0"
        size="small"
        variant="text"
        color="primary"
        class="ml-auto"
        @click="clearTags"
      >
        Сбросить все
      </v-btn>
    </div>

    <v-chip-group v-model="selectedTags" multiple class="mb-4 tag-group" column>
      <v-chip
        v-for="tag in availableTags"
        :key="tag"
        filter
        variant="outlined"
        color="primary"
        density="compact"
        size="small"
        class="ma-1"
      >
        {{ tag }}
      </v-chip>
    </v-chip-group>

    <div v-if="filteredTopics.length === 0" class="text-center my-8">
      <v-icon icon="mdi-magnify-off" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
      <div class="text-h6 text-grey-darken-1">Ничего не найдено</div>
      <div class="text-body-2 text-grey">Попробуйте изменить параметры поиска или фильтры</div>
    </div>

    <v-row>
      <v-col v-for="topic in filteredTopics" :key="topic.id" cols="12">
        <topic-card
          :topic="topic"
          :tags="getTopicTags(topic.id)"
          :progress="getTopicProgressObject(topic.id)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import TopicCard from '../components/TopicCard.vue'
  import topicsData from '../data/topics.json'
  import tagsData from '../data/tags.json'
  import { useProgress } from '../composables/useProgress'

  const searchQuery = ref('')
  const selectedTags = ref([])
  const availableTags = tagsData.available_tags
  const topic_tags = tagsData.topic_tags

  // Используем композабл для работы с прогрессом
  const { progress: topicsProgress, getTopicProgress } = useProgress()

  // Очистка поиска
  const clearSearch = () => {
    searchQuery.value = ''
  }

  // Очистка выбранных тегов
  const clearTags = () => {
    selectedTags.value = []
  }

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

  // Получение тегов для темы по ID
  const getTopicTags = topicId => {
    return topic_tags?.[topicId] || []
  }

  // Получение индексов тегов для темы
  const getTopicTagIndices = topicId => {
    const tags = getTopicTags(topicId)
    return tags.map(tag => availableTags.indexOf(tag)).filter(index => index !== -1)
  }

  const filteredTopics = computed(() => {
    return topicsData.topics.filter(topic => {
      // Проверка поискового запроса
      const query = searchQuery.value || ''
      const matchesSearch = topic.title.toLowerCase().includes(query.toLowerCase())

      // Проверка выбранных тегов
      let matchesTags = true
      if (selectedTags.value.length > 0) {
        const topicTagIds = getTopicTagIndices(topic.id)
        matchesTags = selectedTags.value.some(tagIndex => topicTagIds.includes(tagIndex))
      }

      return matchesSearch && matchesTags
    })
  })
</script>

<style scoped>
  .search-field :deep(.v-field__outline) {
    opacity: 0 !important;
  }

  .tag-group {
    flex-wrap: wrap;
    max-height: 180px;
    overflow-y: auto;
  }
</style>
