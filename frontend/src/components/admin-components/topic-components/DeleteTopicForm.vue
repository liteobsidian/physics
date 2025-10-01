<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма удаления темы</h3>
            <v-btn @click="($emit('update:selectedTopicOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете удалить тему. Выберите нужную вам и нажмите на кнопку "удалить тему". Вместе с темой
            удалятся и задания, которые принадлежат этой теме. Будьте осторожны!
        </span>
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
            <v-btn @click="deleteTopic()" color="primary">Удалить тему </v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { deleteTopicAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        topics: Array,
        selectedTopicOption: String,
    })

    const selectedTopic = ref(null)

    const emit = defineEmits(['update:selectedTopicOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        selectedTopic.value = null
    }

    async function deleteTopic() {
        try {
            const response = await deleteTopicAdmin(selectedTopic.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тема успешно удалёна' })
                cleanFields()
                await props.getData()
                emit('update:selectedTopicOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось удалить тему. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTopicOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
