<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма изменения тэга</h3>
            <v-btn @click="($emit('update:selectedTagOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете изменть название тэга. Выбирите уже существующий тэг и введите для него новое название
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
            <h3 class="editor-font">Название нового тэга:</h3>
            <v-text-field v-model="newTitle" autocomplete="off" label="Введите название" />
        </div>
        <div>
            <v-btn @click="editTag()" color="primary">Изменить тэг </v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { editTagAdmin } from '@/services/admin.service'

    const props = defineProps({
        currentTag: { type: Object, default: () => ({}) },
        tags: Array,
        selectedTagOption: String,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
    })

    const selectedTag = ref(null)
    const newTitle = ref('')

    const emit = defineEmits(['update:selectedTagOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        ;(newTitle.value = null), (selectedTag.value = null)
    }

    async function editTag() {
        try {
            const response = await editTagAdmin(selectedTag.value, newTitle.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тэг успешно изменён' })
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
