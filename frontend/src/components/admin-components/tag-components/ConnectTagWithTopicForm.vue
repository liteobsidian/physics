<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма добавления нового тэга</h3>
            <v-btn @click="($emit('update:selectedTagOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете связать тему с тэгом. Выберите тэг, с которым хотите связать тему, и нажмите на кнопку
            "связать"
        </span>
        <div>
            <h3 class="editor-font">Выбранный тэг:</h3>
            <v-autocomplete
                :items="props.tags"
                item-title="title"
                item-value="id"
                v-model="selectedTag"
                autocomplete="off"
                label="Выберите тэг"
            />
        </div>
        <div>
            <h3 class="editor-font">Выбрананя тема:</h3>
            <v-autocomplete
                :items="props.topics"
                item-title="title"
                item-value="id"
                v-model="selectedTopic"
                autocomplete="off"
                label="Выберите тэг"
            />
        </div>
        <div>
            <v-btn @click="onConnectTagWithTopic()" color="primary">Связать</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits } from 'vue'
    import '@/assets/main.css'
    import { connectTagWithTopic } from '@/services/admin.service.js'

    const props = defineProps({
        selectedTagOption: String,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        tags: Array,
        topics: Array,
    })

    const selectedTag = ref(null)
    const selectedTopic = ref(null)

    const emit = defineEmits(['update:selectedTagOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        ;(selectedTag.value = null), (selectedTopic.value = null)
    }

    async function onConnectTagWithTopic() {
        try {
            const response = await connectTagWithTopic(selectedTag.value, selectedTopic.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тэг успешно объеденён с темой' })
                cleanFields()
                await props.getData()
                emit('update:selectedTagOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось объеденить. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTagOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
