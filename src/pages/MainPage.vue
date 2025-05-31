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
        v-for="tag in tags"
        :key="tag.id"
        filter
        variant="outlined"
        color="primary"
        density="compact"
        size="small"
        class="ma-1"
      >
        {{ tag.title }}
      </v-chip>
    </v-chip-group>

    <div v-if="filteredBlocks.length === 0" class="text-center my-8">
      <v-icon icon="mdi-magnify-off" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
      <div class="text-h6 text-grey-darken-1">Ничего не найдено</div>
      <div class="text-body-2 text-grey">Попробуйте изменить параметры поиска или фильтры</div>
    </div>

    <div v-for="block in filteredBlocks" :key="block.id" class="mb-8">
      <h2 class="text-h5 mb-4 text-wrap">{{ block.title }}</h2>
      <v-row>
        <v-col v-for="topic in block.topics" :key="topic.id" cols="12">
          <topic-card
            :topic="topic"
            :tags="getTopicTags(topic)"
            :progress="getTopicProgressObject(topic.id)"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import TopicCard from '../components/TopicCard.vue'
  import topicsData from '../data/topics.json'
  import blocksData from '../data/blocks.json'
  import tagsData from '../data/tags.json'
  import { useProgress } from '../composables/useProgress'

  const searchQuery = ref('')
  const selectedTags = ref([])
  const tags = tagsData.tags

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

  // Получение объектов тегов для темы
  const getTopicTags = topic => {
    if (!topic.tag_ids || !topic.tag_ids.length) return []
    return topic.tag_ids.map(tagId => tags.find(tag => tag.id === tagId)).filter(Boolean)
  }

  const filteredTopics = computed(() => {
    return topicsData.topics.filter(topic => {
      // Проверка поискового запроса
      const query = searchQuery.value || ''
      const matchesSearch = topic.title.toLowerCase().includes(query.toLowerCase())

      // Проверка выбранных тегов
      let matchesTags = true
      if (selectedTags.value.length > 0) {
        // Теперь сравниваем напрямую ID тегов
        matchesTags = selectedTags.value.some(selectedTagIndex => {
          const selectedTagId = tags[selectedTagIndex].id
          return topic.tag_ids && topic.tag_ids.includes(selectedTagId)
        })
      }

      return matchesSearch && matchesTags
    })
  })

  // Группируем темы по блокам
  const filteredBlocks = computed(() => {
    // Получаем все блоки
    const blocks = blocksData.blocks.map(block => ({
      ...block,
      topics: [],
    }))

    // Распределяем отфильтрованные темы по блокам
    filteredTopics.value.forEach(topic => {
      const blockId = topic.block_id
      if (blockId) {
        const blockIndex = blocks.findIndex(block => block.id === blockId)
        if (blockIndex !== -1) {
          blocks[blockIndex].topics.push(topic)
        }
      }
    })

    // Возвращаем только блоки с темами
    return blocks.filter(block => block.topics.length > 0)
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
