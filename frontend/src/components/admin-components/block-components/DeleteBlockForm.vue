<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма удаления блока</h3>
            <v-btn @click="($emit('update:selectedBlockOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете удалить блок. Выберите блок для удаления и нажмите на кнопку "удалить блок". ВАЖНО! При
            удалении блока, удалять ся все темы входящие в него, а следовательно и все задания, связаныне с темами.
            Будьте осторожны!
        </span>
        <div>
            <h3 class="editor-font">Выбранный блок:</h3>
            <v-autocomplete
                :items="props.blocks"
                item-title="title"
                item-value="id"
                v-model="selectedBlock"
                autocomplete="off"
                label="Выберите блок для удаления"
            />
        </div>

        <div>
            <v-btn @click="deleteBlock()" color="primary">Удалить блок </v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { deleteBlockAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        blocks: Array,
        selectedBlockOption: String,
    })

    const selectedBlock = ref('')

    const emit = defineEmits(['update:selectedBlockOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        selectedBlock.value = null
    }

    async function deleteBlock() {
        try {
            const response = await deleteBlockAdmin(selectedBlock.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Блок успешно удалён' })
                cleanFields()
                await props.getData()
                emit('update:selectedBlockOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось удалить блок. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedBlockOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
