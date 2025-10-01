<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма изменения темы</h3>
            <v-btn @click="($emit('update:selectedTopicOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете изменить тему. Выберите уже существующую и введите новое название</span
        >
        <div>
            <h3 class="editor-font">Выбранная тема:</h3>
            <v-autocomplete
                autocomplete="off"
                :items="props.topics"
                item-title="title"
                item-value="id"
                v-model="selectedTopic"
                label="Выберите тему"
            />
        </div>
        <div>
            <h3 class="editor-font">Название новой темы:</h3>
            <v-text-field v-model="topicTitle" autocomplete="off" label="Введите название новой темы" />
        </div>
        <div>
            <v-btn @click="editTopic()" color="primary">Изменить тему</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { editTopicAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        topics: Array,
        selectedTopicOption: String,
    })

    const selectedTopic = ref(null)
    const topicTitle = ref('')

    const emit = defineEmits(['update:selectedTopicOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        ;(selectedTopic.value = null), (topicTitle.value = null)
    }

    async function editTopic() {
        try {
            const response = await editTopicAdmin(selectedTopic.value, topicTitle.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тема успешно изменёна' })
                cleanFields()
                await props.getData()
                emit('update:selectedTopicOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось изменить тему. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTopicOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
