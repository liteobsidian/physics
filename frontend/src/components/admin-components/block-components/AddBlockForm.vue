<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма добавления нового блока</h3>
            <v-btn @click="($emit('update:selectedBlockOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете добавить новый блок. Просто введите его название и нажмите на кнопку "добавить блок"
        </span>
        <div>
            <h3 class="editor-font">Название блока:</h3>
            <v-text-field v-model="blocktitle" autocomplete="off" label="Введите название" />
        </div>
        <div>
            <v-btn @click="addBlock()" color="primary">Добавить блок</v-btn>
        </div>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { addBlockAdmin } from '@/services/admin.service'

    const props = defineProps({
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        getData: Function,
        selectedBlockOption: String,
    })

    const blocktitle = ref('')

    const emit = defineEmits(['update:selectedBlockOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const cleanFields = () => {
        blocktitle.value = null
    }

    async function addBlock() {
        try {
            const response = await addBlockAdmin(blocktitle.value)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Блок успешно добавлен' })
                cleanFields()
                await props.getData()
                emit('update:selectedBlockOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось добавить блок. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedBlockOption', null)
            return
        }
    }
</script>
<style scoped lang="scss"></style>
