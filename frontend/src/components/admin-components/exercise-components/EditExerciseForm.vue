<template>
    <div class="editor-container">
        <div class="d-flex justify-sm-space-between">
            <h3 class="editor-font">Форма изменения задания</h3>
            <v-btn @click="($emit('update:selectedExerciseOption', null), cleanFields())">Отмена</v-btn>
        </div>
        <span class="editor-description"
            >Здесь вы можете изменть существующее задание. Если задание с изображением нельзя поменять его на текст, это
            касается и подсказки</span
        >
        <div>
            <div class="select-task-options">
                <div>
                    <h3 class="editor-font">Тема:</h3>
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
                    <h3 class="editor-font">Тип задания:</h3>
                    <v-autocomplete
                        :items="props.taskTypes"
                        v-model="selectedTaskType"
                        item-title="title"
                        item-value="type"
                        label="Выберите тип задания"
                        return-object
                        autocomplete="off"
                    />
                </div>
            </div>
            <div>
                <h3 class="editor-font">Выбранное задание:</h3>
                <v-autocomplete
                    :items="filteredExercises"
                    v-model="selectedExercise"
                    item-value="id"
                    item-title="taskShort"
                    return-object
                    autocomplete="off"
                    label="Выберите задание"
                />
            </div>
            <div>
                <div class="editor-header">
                    <div class="id-box">
                        <span style="font-size: 1.7rem; font-weight: bold; color: #4285f4">
                            ID: {{ selectedExercise?.id }}
                        </span>
                    </div>
                    <v-btn @click="isDisabled = !isDisabled" color="#4285f4">Редактировать задание</v-btn>
                </div>
                <div>
                    <h3 class="editor-font">Задание:</h3>
                    <div
                        v-if="isImage(selectedExercise?.task)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img :src="newTaskImgUrl || base64Decode(selectedExercise?.task)" style="max-width: 100%" />
                        <v-file-input
                            label="Внесите новое изображение"
                            v-model="newTaskImg"
                            :disabled="isDisabled"
                        ></v-file-input>
                    </div>
                    <v-textarea
                        label="Изменить текст задания"
                        v-else
                        :model-value="selectedExercise?.task"
                        auto-grow
                        :disabled="isDisabled"
                    ></v-textarea>
                </div>
                <div>
                    <h3 class="editor-font">Подсказка:</h3>
                    <div
                        v-if="isImage(selectedExercise?.hint)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img :src="newHintImgUrl || base64Decode(selectedExercise?.hint)" style="max-width: 100%" />
                        <v-file-input
                            label="Внесите новое изображение"
                            v-model="newHintImg"
                            :disabled="isDisabled"
                        ></v-file-input>
                    </div>

                    <v-textarea
                        v-else
                        :model-value="selectedExercise?.hint"
                        auto-grow
                        label="Изменить текст подсказки"
                        :disabled="isDisabled"
                    ></v-textarea>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="editor-font">Ответ:</h3>
                <v-text-field
                    :model-value="selectedExercise?.answer"
                    label="Поменяйте ответ"
                    :disabled="isDisabled"
                    autocomplete="off"
                ></v-text-field>
            </div>
            <div class="d-flex" style="justify-content: space-between">
                <v-btn @click="editTask()" color="#4285f4"> Внести изменения </v-btn>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { defineProps, ref, computed, watch, defineEmits } from 'vue'
    import '@/assets/main.css'
    import { editTaskAdmin } from '@/services/admin.service'

    const props = defineProps({
        exercises: Object,
        topics: Array,
        taskTypes: Array,
        errorEditingTask: { type: Object, default: () => ({}) },
        successEditingTask: { type: Object, default: () => ({}) },
        selectedExerciseOption: String,
        getData: Function,
    })

    const selectedTopic = ref(null)
    const selectedTaskType = ref(null)
    const selectedExercise = ref(null)
    const newTaskImg = ref(null)
    const newTaskImgUrl = ref(null)
    const newHintImg = ref(null)
    const newHintImgUrl = ref(null)
    const isDisabled = ref(true)

    const taskImgBuffer = ref(null)
    const hintImgBuffer = ref(null)

    const filteredExercises = computed(() => {
        let exercises = props.exercises?.[selectedTaskType.value?.type] ?? []
        if (!Array.isArray(exercises)) return []
        return exercises
            .filter(e => (selectedTopic.value ? e.topic_id === selectedTopic.value.id : true))
            .map(({ id, task, topic_id, hint, answer }) => ({
                id,
                taskShort: String(task).slice(0, 70),
                task: task,
                topic_id,
                hint,
                answer,
            }))
    })

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

    const emit = defineEmits(['update:selectedExerciseOption', 'update:errorEditingTask', 'update:successEditingTask'])

    watch(newTaskImg, f => {
        if (!f) {
            newHintImgUrl.value = null
            return
        }
        const reader = new FileReader()
        reader.onload = e => {
            newTaskImgUrl.value = e.target.result
            const base64 = e.target.result.split(',')[1]
            taskImgBuffer.value = base64
        }
        reader.readAsDataURL(f)
    })
    watch(newHintImg, f => {
        if (!f) {
            newHintImgUrl.value = null
            return
        }
        const reader = new FileReader()
        reader.onload = e => {
            newHintImgUrl.value = e.target.result
            const base64 = e.target.result.split(',')[1]
            hintImgBuffer.value = base64
        }
        reader.readAsDataURL(f)
    })

    const cleanFields = () => {
        ;(selectedExercise.value = null), (selectedTopic.value = null), (selectedTaskType.value = null)
    }

    async function editTask() {
        try {
            const response = await editTaskAdmin(
                !taskImgBuffer.value ? selectedExercise.value?.task : taskImgBuffer.value,
                !hintImgBuffer.value ? selectedExercise.value?.hint : hintImgBuffer.value,
                selectedExercise.value?.answer,
                selectedTaskType.value?.type,
                selectedExercise.value?.id,
            )
            if (response.status === 201) {
                emit('update:successEditingTask', { show: true, text: 'Задание успешно изменено' })
                cleanFields()
                await props.getData()
                emit('update:selectedExerciseOption', null)
            }
        } catch (error) {
            emit('update:errorEditingTask', { show: true, text: `Неудалось изменить задание. Ошибка: ${error}` })
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
