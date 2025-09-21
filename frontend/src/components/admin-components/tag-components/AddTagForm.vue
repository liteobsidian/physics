<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма добавления нового тэга</h3>
            <v-btn @click="($emit('update:selectedTagOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете добавить новый тэг. Введите его название и нажмите на кнопку "добавить тэг"
        </span>
        <div>
            <h3 class="editor-font">Название тэга:</h3>
            <v-text-field v-model="tagTitle" autocomplete="off" label="Введите название тэга" />
        </div>

        <div>
            <v-btn @click="addTag()" color="primary">Добавить тэг</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { addTagAdmin } from '@/services/admin.service.js'

    const props = defineProps({
        selectedTagOption: String,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
    })

    const tagTitle = ref('')

    const emit = defineEmits(['update:selectedTagOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        tagTitle.value = null
    }

    async function addTag() {
        try {
            const response = await addTagAdmin(tagTitle.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тэг успешно изменено' })
                cleanFields()
                await props.getData()
                emit('update:selectedTagOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось добавить тэг. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTagOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
