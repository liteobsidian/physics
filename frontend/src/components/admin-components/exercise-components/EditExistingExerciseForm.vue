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
                        v-model="selectedTaskType"
                        :items="taskTypes"
                        item-title="title"
                        item-value="type"
                        label="Выберите тип задания"
                        return-object
                        autocomplete="off"
                        @update:modelValue="$emit('update:newTaskType', $event.target.value)"
                    />
                </div>
            </div>
            <div>
                <span>Выбирите задание</span>
                <v-autocomplete
                    :items="filteredExercises"
                    v-model="selectedExercise"
                    item-value="id"
                    item-title="task"
                    return-object
                    autocomplete="off"
                    @update:modelValue="$emit('update:taskId', $event.target.value)"
                />
            </div>
            <div>
                <div class="editor-header">
                    <div class="id-box">
                        <span style="font-size: 1.7rem; font-weight: bold; color: #4285f4"
                            >ID: {{ filteredSelectedExercise?.id }}</span
                        >
                    </div>
                    <v-btn @click="isDisabled = !isDisabled" color="#4285f4">Редактировать задание</v-btn>
                </div>
                <div>
                    <div
                        v-if="isImage(filteredSelectedExercise?.task)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img
                            :src="newTaskImgUrl || base64Decode(filteredSelectedExercise?.task)"
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
                        :model-value="filteredSelectedExercise?.task"
                        auto-grow
                        :disabled="isDisabled"
                        @update:modelValue="$emit('update:newTaskText', $event.target.value)"
                    ></v-textarea>
                </div>
                <div>
                    <span>Подсказка</span>
                    <div
                        v-if="isImage(filteredSelectedExercise?.hint)"
                        style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                    >
                        <img
                            :src="newHintImgUrl || base64Decode(filteredSelectedExercise?.hint)"
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
                        :model-value="filteredSelectedExercise?.hint"
                        auto-grow
                        label="Изменить текст подсказки"
                        :disabled="isDisabled"
                        @update:modelValue="$emit('update:newHintText', $event.target.value)"
                    ></v-textarea>
                </div>
            </div>
            <div class="mt-4">
                <span>Ответ</span>
                <v-text-field
                    :model-value="filteredSelectedExercise?.answer"
                    label="Поменяйте ответ"
                    :disabled="isDisabled"
                    @update:modelValue="$emit('update:newAnswer', $event.target.value)"
                    autocomplete="off"
                ></v-text-field>
            </div>
            <v-btn>Внести изменения</v-btn>
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
        task: Object,
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
        return exercises
            .filter(e => (selectedTopic.value ? e.topic_id === selectedTopic.value.id : true))
            .map(({ id, task, topic_id, hint, answer }) => ({
                id,
                task: String(task).slice(0, 70),
                topic_id,
                hint,
                answer,
            }))
    })
    const filteredSelectedExercise = computed(() => {
        return props.exercises?.[selectedTaskType.value?.type]?.filter(e => selectedExercise.value?.id === e.id)[0]
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

    const emit = defineEmits(['update:newTaskImgBuffer'], ['update:newHintImageBuffer'])

    watch(newTaskImg, f => {
        if (!f) {
            newHintImgUrl.value = null
            return
        }
        const reader = new FileReader()
        reader.onload = e => {
            newTaskImgUrl.value = e.target.result
            const base64 = e.target.result.split(',')[1]
            emit('update:newTaskImgBuffer', base64)
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
            emit('update:newHintImageBuffer', base64)
        }
        reader.readAsDataURL(f)
    })
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
