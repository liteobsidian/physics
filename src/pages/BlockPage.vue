<template>
  <div class="mt-4">
    <div class="d-flex align-center mb-4">
      <v-btn
        variant="text"
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="$router.push('/')"
      >
        Назад к списку
      </v-btn>
    </div>

    <h1 class="text-h4 mb-6 text-wrap">{{ block?.title || 'Загрузка...' }}</h1>

    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 200px">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="!block" class="text-center my-8">
      <v-icon icon="mdi-alert-circle" size="x-large" color="error" class="mb-2"></v-icon>
      <div class="text-h6 text-grey-darken-1">Блок не найден</div>
      <v-btn class="mt-4" color="primary" variant="outlined" @click="$router.push('/')">
        Вернуться на главную
      </v-btn>
    </div>

    <v-row v-else>
      <v-col v-for="topic in blockTopics" :key="topic.id" cols="12">
        <topic-card
          :topic="topic"
          :tags="getTopicTags(topic)"
          :progress="getTopicProgressObject(topic.id)"
        />
      </v-col>

      <v-col v-if="blockTopics.length === 0" cols="12" class="text-center my-8">
        <v-icon icon="mdi-book-off" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
        <div class="text-h6 text-grey-darken-1">В данном блоке нет тем</div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import TopicCard from '../components/TopicCard.vue'
  import topicsData from '../data/topics.json'
  import blocksData from '../data/blocks.json'
  import tagsData from '../data/tags.json'
  import { useProgress } from '../composables/useProgress'

  const route = useRoute()
  const blockId = parseInt(route.params.id)
  const loading = ref(true)
  const tags = tagsData.tags

  // Используем композабл для работы с прогрессом
  const { progress: topicsProgress, getTopicProgress } = useProgress()

  // Блок
  const block = computed(() => {
    return blocksData.blocks.find(b => b.id === blockId) || null
  })

  // Темы для текущего блока
  const blockTopics = computed(() => {
    return topicsData.topics.filter(topic => topic.block_id === blockId)
  })

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

  // Инициализация
  onMounted(() => {
    loading.value = false
  })
</script>
