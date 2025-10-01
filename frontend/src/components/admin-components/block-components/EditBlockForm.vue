<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма изменения блока</h3>
            <v-btn @click="($emit('update:selectedBlockOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете изменить название блок. Выберите блок, название которого хотите изменить и введите новое
        </span>
        <div>
            <h3 class="editor-font">Выбранный блок:</h3>
            <v-autocomplete
                :items="props.blocks.data"
                item-title="title"
                item-value="id"
                v-model="selectedBlock"
                autocomplete="off"
                label="Выберите блок"
            />
        </div>
        <div>
            <h3 class="editor-font">Новое название блока:</h3>
            <v-text-field v-model="newTitle" autocomplete="off" label="Введите название" />
        </div>
        <div>
            <v-btn @click="editBlock()" color="primary">Изменить блок</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { editBlockAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        blocks: Array,
        selectedBlockOption: String,
    })

    const selectedBlock = ref('')
    const newTitle = ref('')

    const emit = defineEmits(['update:selectedBlockOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        ;(selectedBlock.value = null), (newTitle.value = null)
    }

    async function editBlock() {
        try {
            const response = await editBlockAdmin(selectedBlock.value, newTitle.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Блок успешно изменён' })
                cleanFields()
                await props.getData()
                emit('update:selectedBlockOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось изменить блок. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedBlockOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
