<template>
  <v-text-field
    v-model="searchValue"
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
    @input="updateSearch"
  ></v-text-field>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const searchValue = ref(props.modelValue)

  // Синхронизация с родительским компонентом
  watch(
    () => props.modelValue,
    newValue => {
      searchValue.value = newValue
    },
  )

  // Обновление при изменении
  const updateSearch = () => {
    emit('update:modelValue', searchValue.value)
  }

  // Очистка поиска
  const clearSearch = () => {
    searchValue.value = ''
    emit('update:modelValue', '')
  }
</script>

<style scoped>
  .search-field :deep(.v-field__outline) {
    opacity: 0 !important;
  }
</style>
