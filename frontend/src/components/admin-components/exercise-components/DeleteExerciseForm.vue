<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма удаления задания</h3>
            <v-btn @click="($emit('update:selectedExerciseOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете удалить задание. выбирите темв и тип, затем выбирите задание, которое хотите удалить</span
        >
        <div>
            <div class="select-task-options">
                <div>
                    <span style="color: #4285f4; font-weight: bold">Тема</span>
                    <v-autocomplete
                        :items="props.topics"
                        item-value="id"
                        item-title="title"
                        label="Выбирите тему"
                        return-object
                        autocomplete="off"
                        v-model="selectedTopic"
                    />
                </div>
                <div>
                    <span style="color: #4285f4; font-weight: bold">Тип задания</span>
                    <v-autocomplete
                        :items="props.types"
                        v-model="selectedType"
                        item-title="title"
                        item-value="type"
                        label="Выберите тип задания"
                        return-object
                        autocomplete="off"
                    />
                </div>
            </div>
            <div>
                <span style="color: #4285f4; font-weight: bold">Выбирите задание</span>
                <v-autocomplete
                    :items="filteredExercises"
                    v-model="selectedExercise"
                    item-value="id"
                    item-title="taskShort"
                    return-object
                    autocomplete="off"
                />
            </div>
            <div>
                <div class="editor-header">
                    <div class="id-box">
                        <span style="font-size: 1.7rem; font-weight: bold; color: #4285f4"
                            >ID: {{ selectedExercise?.id }}</span
                        >
                    </div>
                </div>
                <div>
                    <h3 class="editor-font">Задание:</h3>
                    <div v-if="isImage(selectedExercise?.task)" class="d-flex">
                        <v-img :src="base64Decode(selectedExercise?.task)" class="mx-auto" max-width="100%" />
                    </div>
                    <v-textarea v-else :model-value="selectedExercise?.task" auto-grow readonly="true"></v-textarea>
                </div>
                <div>
                    <h3 class="editor-font">Подсказка:</h3>
                    <div v-if="isImage(selectedExercise?.hint)" class="d-flex align-md-center">
                        <v-img :src="base64Decode(selectedExercise?.hint)" class="mx-auto" max-width="100%" />
                    </div>

                    <v-textarea v-else :model-value="selectedExercise?.hint" auto-grow readonly="true"></v-textarea>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="editor-font">Ответ:</h3>
                <v-text-field :model-value="selectedExercise?.answer" autocomple="off" readonly="true"></v-text-field>
            </div>
            <div class="d-flex" style="justify-content: space-between">
                <v-btn @click="deleteTask()" color="#4285f4"> Удалить задание </v-btn>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { defineProps, computed, ref, defineEmits, watch } from 'vue'
    import '@/assets/main.css'
    import { deleteTaskAdmin } from '@/services/admin.service'

    const props = defineProps({
        exercises: Array,
        topics: Array,
        types: Array,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        selectedExerciseOption: String,
        getData: Function,
    })

    const selectedTopic = ref(null)
    const selectedType = ref(null)
    const selectedExercise = ref(null)

    const filteredExercises = computed(() => {
        let exercises = props.exercises?.[selectedType.value?.type] ?? []
        if (!Array.isArray(exercises)) return []
        return exercises
            .filter(e => (selectedTopic.value ? e.topic_id === selectedTopic.value?.id : true))
            .map(({ id, task, topic_id, hint, answer }) => ({
                id,
                taskShort: String(task).slice(0, 70),
                task: task,
                topic_id,
                hint,
                answer,
            }))
    })

    const emit = defineEmits(['update:selectedExerciseOption', 'update:errorEditingTask', 'update:successEditingTask'])

    const imageSignatures = ['/9j/', 'iVBORw0KGgo']
    const isImage = i => imageSignatures.some(sig => i?.includes(sig))

    const base64Decode = i => {
        if (i?.includes(imageSignatures[0])) {
            return `data:image/jpeg;base64,${i}`
        } else if (i?.includes(imageSignatures[1])) {
            return `data:image/png;base64,${i}`
        }
        return ''
    }

    const cleanFields = () => {
        ;(selectedExercise.value = null), (selectedTopic.value = null), (selectedType.value = null)
    }

    async function deleteTask() {
        try {
            const response = await deleteTaskAdmin(selectedExercise.value?.id, selectedType.value?.type)
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Задание успешно удалено' })
                cleanFields()
                await props.getData()
                emit('update:selectedExerciseOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось удалить задание. Ошибка: ${error}` })
            cleanFields()
            console.log(error)
            emit('update:selectedExerciseOption', null)
            return
        }
    }
</script>
<style lang="scss" scoped>
    .select-task-options {
        display: flex;
        justify-content: space-between;
    }
    .select-task-options div {
        flex: 1;
        margin-right: 2rem;
    }
    .select-task-options div:last-child {
        margin-right: 0;
    }
    .editor-header {
        display: flex;
        justify-content: space-between;
    }
    .editor-header div {
        flex: 1;
        margin-right: 2rem;
    }
    .editor-header div:last-child {
        margin-right: 0;
    }
    .id-box {
        display: flex;
        align-items: center;
        max-width: 20%;
    }
</style>
