<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма добавления новой темы</h3>
            <v-btn @click="($emit('update:selectedTopicOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете добавить новую тему. Вам нужно выбрать блок, к которому будет принадлежать тема, и ввести
            название темы
        </span>
        <div>
            <h3 class="editor-font">Выбранный блок:</h3>
            <v-autocomplete
                autocomplete="off"
                :items="blocks"
                item-title="title"
                item-value="id"
                v-model="selectedBlock"
                label="Выбранный блок"
            />
        </div>
        <div>
            <h3 class="editor-font">Тема:</h3>
            <v-text-field v-model="topicTitle" autocomplete="off" label="Введите название новой темы" />
        </div>
        <div>
            <v-btn @click="addTopic()" color="primary">Добавить тему</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { addTopicAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        blocks: Array,
        selectedTopicOption: String,
    })

    const selectedBlock = ref(null)
    const topicTitle = ref('')

    const emit = defineEmits(['update:selectedTopicOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        ;(selectedBlock.value = null), (topicTitle.value = null)
    }

    async function addTopic() {
        try {
            const response = await addTopicAdmin(topicTitle.value, selectedBlock.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тема успешно добавлена' })
                cleanFields()
                await props.getData()
                emit('update:selectedTopicOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось добавить тему. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTopicOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
