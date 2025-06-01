<template>
  <v-row>
    <v-col cols="12" class="my-2">
      <v-progress-linear :model-value="progressValue" :color="color" height="20" rounded>
        <template #default>
          <strong>{{ Math.ceil(progressValue) }}%</strong>
        </template>
      </v-progress-linear>
    </v-col>

    <template v-if="exercises.length > 0">
      <v-col v-for="exercise in exercises" :key="exercise.id" cols="6" sm="4" md="3">
        <v-card
          @click="$emit('exercise-click', exercise)"
          class="exercise-card"
          :class="{
            completed: isExerciseCompleted(exercise.id),
          }"
          rounded="lg"
          elevation="2"
          height="100px"
        >
          <v-card-text class="d-flex justify-center align-center fill-height">
            <span class="text-h5">{{ exercise.id }}</span>
            <v-icon v-if="isExerciseCompleted(exercise.id)" color="success" class="completed-icon">
              mdi-check-circle
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </template>

    <v-col v-else cols="12">
      <div class="no-exercises-message d-flex align-center justify-center w-100 my-4">
        <v-icon color="grey-lighten-1" class="mr-2">mdi-information-outline</v-icon>
        <span class="text-body-1 text-grey-darken-1">{{ emptyMessage }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
  defineProps({
    exercises: {
      type: Array,
      default: () => [],
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'primary',
    },
    isExerciseCompleted: {
      type: Function,
      required: true,
    },
    emptyMessage: {
      type: String,
      default: 'Задания ещё не добавлены',
    },
  })

  defineEmits(['exercise-click'])
</script>

<style scoped>
  .exercise-card {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 10px;
    border: 1px solid rgba(0, 0, 0, 0.03);
  }

  .exercise-card:hover {
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  .exercise-card.completed {
    background-color: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.2);
  }

  .completed-icon {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 1.2rem;
  }

  .completed-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(76, 175, 80, 0.1);
    border-radius: 6px;
    padding: 8px;
    height: 20px;
    color: var(--v-success-base, #4caf50);
  }

  .no-exercises-message {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 8px;
    padding: 24px;
    border: 1px dashed rgba(0, 0, 0, 0.1);
  }
</style>
