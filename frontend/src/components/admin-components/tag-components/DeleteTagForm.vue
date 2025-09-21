<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма удаления тэга</h3>
            <v-btn @click="($emit('update:selectedTagOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете удалить существующий тэг. Просто выберите нужный тэг и нажмите кнопку "удалить тэг"
        </span>
        <div>
            <h3 class="editor-font">Название тэга:</h3>
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
            <v-btn @click="deleteTag()" color="primary">Удалить тэг</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { deleteTagAdmin } from '@/services/admin.service'

    const props = defineProps({
        tags: Array,
        selectedTagOption: String,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
    })

    const selectedTag = ref('')

    const emit = defineEmits(['update:selectedTagOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        selectedTag.value = null
    }

    async function deleteTag() {
        try {
            const response = await deleteTagAdmin(selectedTag.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Тэг успешно удалён' })
                cleanFields()
                await props.getData()
                emit('update:selectedTagOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось удалить тэг. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedTagOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
