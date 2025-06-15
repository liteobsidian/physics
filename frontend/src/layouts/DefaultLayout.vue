<template>
  <v-app>
    <v-app-bar color="white" elevation="0" id="app-header">
      <div class="d-flex justify-center w-100">
        <div class="d-flex justify-space-between align-center w-100 container">
          <div class="text-caption d-flex flex-column align-center status">
            <div class="text-grey">{{ daysCount }} д</div>
            <div v-if="totalProgress < 100" class="text-primary">{{ totalProgress }}%</div>
            <div v-else class="d-flex align-center">
              <v-icon color="success" size="16">mdi-check-circle</v-icon>
            </div>
          </div>

          <v-app-bar-title class="text-primary d-flex align-center justify-center">
            <v-icon color="primary" class="mr-2">mdi-flask</v-icon>
            Физичитариум
          </v-app-bar-title>

          <v-tooltip location="bottom" text="Личный кабинет находится в разработке">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-account" variant="text" color="black" v-bind="props"></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="d-flex justify-center">
        <div style="max-width: 800px; width: 100%">
          <router-view></router-view>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useProgress } from '../composables/useProgress'

  // Данные о прогрессе будем хранить в localStorage
  const daysCount = ref(0)
  const { calculateTotalProgress } = useProgress()

  // Вычисляем общий прогресс
  const totalProgress = computed(() => {
    return calculateTotalProgress()
  })

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
    max-width: 800px;
    width: 100%;
  }

  .status {
    width: 48px;
    padding: 0 auto;
  }
</style>
