<template>
    <div
        v-show="onAddEditExistingTask"
        @update="$emit('update:onAddEditExistingTask', $event.target.value)"
        class="admin-edit-task"
    >
        <div>
            <div class="select-task-options">
                <div>
                    <span>Тема</span>
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
                    <span>Тип задания</span>
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
                <span>Выбирите задание</span>
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
                            >ID: {{ props.task.id }}</span
                        >
                    </div>
                    <v-btn @click="isDisabled = !isDisabled" color="#4285f4">Редактировать задание</v-btn>
                </div>
                <div>
                    <div
                        v-if="isImage(props.task.taskText)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img
                            :src="newTaskImgUrl || base64Decode(props.task.taskText)"
                            style="max-width: 100%; border-radius: 8px"
                        />
                        <v-file-input
                            label="Внесите новое изображение"
                            v-model="newTaskImg"
                            :disabled="isDisabled"
                        ></v-file-input>
                    </div>
                    <v-textarea
                        label="Изменить текст задания"
                        v-else
                        :model-value="props.task.taskText"
                        auto-grow
                        :disabled="isDisabled"
                        @update:modelValue="val => updateField('taskText', val)"
                    ></v-textarea>
                </div>
                <div>
                    <span>Подсказка</span>
                    <div
                        v-if="isImage(props.task.hintText)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img
                            :src="newHintImgUrl || base64Decode(props.task.hintText)"
                            style="max-width: 100%; border-radius: 8px"
                        />
                        <v-file-input
                            label="Внесите новое изображение"
                            v-model="newHintImg"
                            :disabled="isDisabled"
                        ></v-file-input>
                    </div>

                    <v-textarea
                        v-else
                        :model-value="props.task.hintText"
                        auto-grow
                        label="Изменить текст подсказки"
                        :disabled="isDisabled"
                        @update:modelValue="val => updateField('hintText', val)"
                    ></v-textarea>
                </div>
            </div>
            <div class="mt-4">
                <span>Ответ</span>
                <v-text-field
                    :model-value="props.task.answer"
                    label="Поменяйте ответ"
                    :disabled="isDisabled"
                    @update:modelValue="val => updateField('answer', val)"
                    autocomplete="off"
                ></v-text-field>
            </div>
            <v-btn @click="(editTask(), $emit('update:onAddEditExistingTask', !onAddEditExistingTask))"
                >Внести изменения</v-btn
            >
        </div>
    </div>
</template>
<script setup>
    import { defineProps, ref, computed, watch, defineEmits } from 'vue'

    const props = defineProps({
        exercises: Object,
        topics: Array,
        onAddEditExistingTask: Boolean,
        taskTypes: Array,
        task: { type: Object, default: () => ({}) },
        editTask: Function,
    })

    const selectedTopic = ref(null)
    const selectedTaskType = ref(null)
    const selectedExercise = ref(null)
    const newTaskImg = ref(null)
    const newTaskImgUrl = ref(null)
    const newHintImg = ref(null)
    const newHintImgUrl = ref(null)
    const isDisabled = ref(true)

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

    const imageSignatures = ['/9j/', 'iVBORw0KGgo=']
    const isImage = i => {
        if (i?.includes(imageSignatures[0] || imageSignatures[1])) return true
        return false
    }
    const base64Decode = i => {
        if (i?.includes(imageSignatures[0])) {
            return `data:image/jpeg;base64,${i}`
        } else if (i?.includes(imageSignatures[1])) {
            return `data:image/png;base64,${i}`
        }
        return ''
    }

    const emit = defineEmits(['update:task', 'update:onAddEditExistingTask'])

    function updateField(key, value) {
        emit('update:task', { ...props.task, [key]: value })
    }
    watch(newTaskImg, f => {
        if (!f) {
            newHintImgUrl.value = null
            return
        }
        const reader = new FileReader()
        reader.onload = e => {
            newTaskImgUrl.value = e.target.result
            const base64 = e.target.result.split(',')[1]
            updateField('taskImgBuffer', base64)
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
            updateField('hintImgBuffer', base64)
        }
        reader.readAsDataURL(f)
    })
    watch(selectedExercise, exercise => {
        if (!exercise) return
        emit('update:task', {
            ...props.task,
            taskText: exercise.task,
            hintText: exercise.hint,
            answer: exercise.answer,
            id: exercise.id,
            topic: exercise.topic_id,
        })
    })
    watch(selectedTaskType, val => updateField('taskType', val))
</script>
<style lang="scss" scoped>
    .admin-edit-task {
        display: flex;
        padding: 2.5rem;
        border-radius: 8px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        gap: 2rem;
        flex-direction: column;
    }
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
