<template>
  <div class="mt-4">
    <search-field v-model="searchQuery" />

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

    <v-expansion-panels v-model="expandedPanels" multiple class="expansion-panels">
      <v-expansion-panel
        v-for="block in filteredBlocks"
        :key="block.id"
        :value="block.id"
        rounded="lg"
      >
        <v-expansion-panel-title color="grey-lighten-4">
          <div class="d-flex justify-space-between align-center w-100">
            <div class="text-h6 text-primary">{{ block.title }}</div>
            <v-btn
              variant="text"
              color="primary"
              :to="`/block/${block.id}`"
              class="ml-auto mr-2"
              size="small"
              icon
              @click.stop
            >
              <v-icon icon="mdi-arrow-right-circle-outline"></v-icon>
            </v-btn>
          </div>
          <template v-slot:actions>
            <v-icon icon="$expand"></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col v-for="topic in block.topics" :key="topic.id" cols="12">
              <topic-card
                :topic="topic"
                :tags="getTopicTags(topic)"
                :progress="getTopicProgressObject(topic.id)"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import TopicCard from '../components/TopicCard.vue'
  import SearchField from '../components/SearchField.vue'
  import topicsData from '../data/topics.json'
  import blocksData from '../data/blocks.json'
  import tagsData from '../data/tags.json'
  import { useProgress } from '../composables/useProgress'

  const searchQuery = ref('')
  const selectedTags = ref([])
  const tags = tagsData.tags
  const expandedPanels = ref([])

  // Используем композабл для работы с прогрессом
  const { progress: topicsProgress, getTopicProgress } = useProgress()

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
        matchesTags = selectedTags.value.every(selectedTagIndex => {
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

  // Следим за изменениями фильтров и автоматически разворачиваем блоки при поиске или фильтрации
  watch([searchQuery, selectedTags], () => {
    if (searchQuery.value || selectedTags.value.length > 0) {
      // Если есть поиск или фильтры, разворачиваем все видимые блоки
      expandedPanels.value = filteredBlocks.value.map(block => block.id)
    } else {
      // Если поиск и фильтры пусты, сворачиваем все блоки
      expandedPanels.value = []
    }
  })
</script>

<style scoped>
  .tag-group {
    flex-wrap: wrap;
    max-height: 180px;
    overflow-y: auto;
  }

  .v-expansion-panels {
    background: transparent;
  }

  .expansion-panels :deep(.v-expansion-panel) {
    margin-bottom: 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  }

  .v-expansion-panel-title {
    min-height: 48px !important;
  }

  .expansion-panels :deep(.v-expansion-panel-title) {
    padding: 8px 16px;
  }

  .expansion-panels :deep(.v-expansion-panel-text__wrapper) {
    padding: 12px 16px;
  }

  .expansion-panels :deep(.text-h6) {
    font-size: 1rem !important;
    line-height: 1.2;
  }
</style>
