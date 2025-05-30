<template>
  <v-app>
    <v-app-bar color="white" elevation="0" id="app-header">
      <div class="d-flex justify-center w-100">
        <div class="d-flex justify-space-between align-center w-100 container">
          <v-tooltip
            v-if='route.path === "/"'
            location="bottom"
            text="Личный кабинет находится в разработке"
          >
            <template v-slot:activator="{ props }">
              <v-btn 
                icon="mdi-account" 
                variant="text" 
                color="black"
                v-bind="props"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-btn 
            v-else
            icon="mdi-arrow-left" 
            variant="text" 
            color="black"
            @click="$router.back()"
          />
          <v-app-bar-title class="text-primary d-flex align-center justify-center">
            <v-icon color="primary" class="mr-2">mdi-flask</v-icon>
            НАФИЗИЧЬ
          </v-app-bar-title>
          <div class="text-caption d-flex flex-column align-end">
            <div class="text-grey">{{ daysCount }} д</div>
            <div class="text-primary">{{ totalProgress }}%</div>
          </div>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="d-flex justify-center">
        <div style="max-width: 800px; width: 100%;">
          <router-view></router-view>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMainPage = computed(() => route.path === '/')

// Данные о прогрессе будем хранить в localStorage
const daysCount = ref(0)
const totalProgress = computed(() => {
  const progressData = getProgressFromLocalStorage()
  if (!progressData) return 0
  
  // Подсчет общего прогресса по всем темам
  let totalCompleted = 0
  let totalItems = 0
  
  Object.values(progressData).forEach(topicProgress => {
    // Учитываем изучение, упражнения и повторение
    if (topicProgress.study !== undefined) totalItems++
    if (topicProgress.exercise !== undefined) totalItems++
    if (topicProgress.repetition !== undefined) totalItems++
    
    if (topicProgress.study === 100) totalCompleted++
    if (topicProgress.exercise === 100) totalCompleted++
    if (topicProgress.repetition === 100) totalCompleted++
  })
  
  return totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0
})

// Получение данных о прогрессе из localStorage
function getProgressFromLocalStorage() {
  const progressData = localStorage.getItem('topicsProgress')
  return progressData ? JSON.parse(progressData) : {}
}

onMounted(() => {
  // Подсчет дней использования приложения
  const startDate = localStorage.getItem('startDate')
  if (!startDate) {
    localStorage.setItem('startDate', new Date().toISOString())
    daysCount.value = 0
  } else {
    const start = new Date(startDate)
    const now = new Date()
    const diffTime = Math.abs(now - start)
    daysCount.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  
  // Инициализация прогресса если его нет
  if (!localStorage.getItem('topicsProgress')) {
    localStorage.setItem('topicsProgress', JSON.stringify({}))
  }
})
</script>

<style scoped>
#app-header {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
  padding: 0 2rem;
}

.v-app-bar {
  border-bottom: none !important;
}

.header-border {
  display: none;
}

.container {
  max-width: 800px; width: 100%;
}
</style> 