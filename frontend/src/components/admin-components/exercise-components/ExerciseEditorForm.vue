<template>
    <div v-show="onAddTaskEditor" @update="$emit('update:onAddTaskEditor', $event.target.value)" class="admin-add-task">
        <div class="d-flex admin-task-editor-buttons">
            <v-btn
                @click="((onAddImage = !onAddImage), (onAddText = false), (taskText = null))"
                width="40%"
                height="3rem"
                style="align-self: center"
                >Добавить изображение</v-btn
            >
            <span>или</span>
            <v-btn
                @click="((onAddText = !onAddText), (onAddImage = false), (taskImage = null))"
                width="40%"
                height="3rem"
                style="align-self: center"
                >Добавить текст</v-btn
            >
        </div>

        <div v-show="onAddImage">
            <v-file-input
                label="Внесите изображение для задания"
                accept="image/*"
                v-model="taskImage"
                variant="underlined"
            ></v-file-input>
        </div>
        <div v-show="onAddText">
            <v-textarea
                label="Введите текст задания"
                :model-value="props.taskText"
                @update:modelValue="val => emit('update:taskText', val)"
                content-type="html"
                variant="filled"
                autocomplete="off"
                auto-grow
            />
        </div>
        <div>
            <span style="color: #4285f4; font-weight: bold">Ответ</span>
            <v-text-field
                label="Введите ответ к заданию"
                :model-value="props.taskAnswer"
                @update:modelValue="$emit('update:taskAnswer', $event)"
                autocomplete="off"
            ></v-text-field>
        </div>
        <div class="d-flex" style="flex-direction: column">
            <span style="color: #4285f4; font-weight: bold">Подсказка</span>
            <h5 style="color: #7d7d7d">Можно сделать подсказку либо с тестом, либо с изображением</h5>
            <v-text-field
                label="Введите подсказку"
                :model-value="props.taskHintText"
                @click="taskHintImage = null"
                @update:modelValue="$emit('update:taskHintText', $event)"
                autocomplete="off"
            ></v-text-field>
            <span class="text-center" style="color: #7d7d7d">или</span>
            <v-file-input
                label="Внесите изображение для подсказки"
                accept="image/*"
                v-model="taskHintImage"
                variant="underlined"
                @click="taskHintText = null"
            ></v-file-input>
        </div>
        <div>
            <span style="color: #4285f4; font-weight: bold">Тема</span>
            <v-autocomplete
                :model-value="props.selectedTopic"
                @update:modelValue="$emit('update:selectedTopic', $event)"
                :items="props.topics"
                item-title="title"
                item-value="id"
                label="Выберите тему"
                return-object
                autocomplete="off"
            />
        </div>
        <div>
            <span style="color: #4285f4; font-weight: bold">Тип задания</span>
            <v-autocomplete
                :model-value="selectedTaskType"
                @update:modelValue="$emit('update:selectedTaskType', $event)"
                :items="props.taskTypes"
                item-title="title"
                item-value="type"
                label="Выберите тип задания"
                return-object
            />
        </div>
        <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" color="#4285f4" text="Посмотреть задание" variant="flat"></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card :title="`Просмотр задания типа: ${selectedTaskType?.title || 'Не выбрано'}`">
                    <v-card-text>
                        <span class="mb-4">Выбранная тема: {{ selectedTopic?.title || 'Не выбрано' }}</span>
                        <div v-if="isImage(taskImage)" class="d-flex mb-4 mt-4" style="justify-content: center">
                            <img v-if="taskImageUrl" :src="taskImageUrl" style="max-width: 100%; border-radius: 8px" />
                        </div>
                        <div v-else class="text-body-1 mb-4 mt-4 task-text" v-html="taskText"></div>
                        <v-expansion-panels class="mb-4 hint-panel">
                            <v-expansion-panel density="compact" class="hint-panel-outline" elevation="0">
                                <v-expansion-panel-title>
                                    <v-icon size="small" color="amber-darken-2" class="me-2"
                                        >mdi-lightbulb-outline</v-icon
                                    >
                                    <span class="text-body-2">Подсказка</span>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text class="text-body-2">
                                    <!-- Подсказка с изображением -->
                                    <div v-if="isImage(taskHintImage)" class="text-center">
                                        <v-img
                                            v-if="taskHintImageUrl"
                                            :src="taskHintImageUrl"
                                            max-width="100%"
                                            contain
                                            class="mx-auto"
                                        ></v-img>
                                    </div>
                                    <!-- Подсказка с HTML -->
                                    <div v-else v-html="taskHintText"></div>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <span>Ответ: {{ taskAnswer }}</span>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Вернуться к редактированию" @click="isActive.value = false"></v-btn>
                        <v-btn
                            style="background-color: #4285f4"
                            color="#ffff"
                            text="Добавить задание"
                            @click="
                                (addTask(), (isActive.value = false), $emit('update:onAddTaskEditor', !onAddTaskEditor))
                            "
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>
<script setup>
    import { ref, defineProps, defineEmits, watch, computed } from 'vue'

    const props = defineProps({
        taskText: String,
        taskAnswer: String,
        taskHintText: String,
        topics: Array,
        taskTypes: Array,
        selectedTaskType: [String, Object],
        selectedTopic: [String, Object],
        addTask: Function,
        onAddTaskEditor: Boolean,
        taskImgBuffer: String,
        taskHintImgBuffer: String,
    })

    const taskImage = ref(null)
    const taskHintImage = ref(null)
    const taskImageUrl = ref(null)
    const taskHintImageUrl = ref(null)
    console.log('ok')

    const emit = defineEmits(['update:taskImgBuffer'], ['update:taskHintImgBuffer'])

    watch([taskImage, taskHintImage], ([newTaskImage, newTaskHintImg]) => {
        if (newTaskImage && newTaskImage instanceof File) {
            const reader1 = new FileReader()
            reader1.onload = e => {
                taskImageUrl.value = URL.createObjectURL(newTaskImage)
                const base64 = e.target.result.split(',')[1]
                emit('update:taskImgBuffer', base64)
            }
            reader1.readAsDataURL(newTaskImage)
        } else {
            emit('update:taskImgBuffer', null)
        }

        if (newTaskHintImg && newTaskHintImg instanceof File) {
            const reader2 = new FileReader()
            reader2.onload = e => {
                taskHintImageUrl.value = URL.createObjectURL(newTaskHintImg)
                const base64 = e.target.result.split(',')[1]
                emit('update:taskHintImgBuffer', base64)
            }
            reader2.readAsDataURL(newTaskHintImg)
        } else {
            emit('update:taskHintImgBuffer', null)
        }
    })
    const isImage = task => {
        if (task instanceof Blob) {
            return true
        } else {
            return false
        }
    }

    const onAddImage = ref(false)
    const onAddText = ref(false)
</script>
<style scoped lang="scss">
    .admin-add-task {
        display: flex;
        padding: 2.5rem;
        border-radius: 8px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        gap: 2rem;
        flex-direction: column;
    }
    :deep(.ql-editor) {
        min-height: 200px;
        font-size: 16px;
    }

    :deep(.ql-toolbar) {
        border-radius: 8px 8px 0 0;
    }
    .admin-choice {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: space-between;
    }
    .text-area {
        background-color: #ececec;
        border-bottom: 1px solid #9d9d9d;
        width: 70%;
        height: 2rem;
        text-align: center;
    }
    .admin-task-editor-buttons {
        flex-direction: column;
        justify-content: center;
        text-align: center;
        gap: 0.5rem;
    }
    .check-task-admin {
        width: 100%;
    }
    .hint-panel-outline {
        border: 1px solid rgba(0, 0, 0, 0.12) !important;
    }
    .hint-panel {
        max-width: 100%;
    }
    .task-tags-admin {
        flex-wrap: wrap;
        max-height: 180px;
        overflow-y: auto;
        gap: 5px;
    }
    .mb-4 {
        margin-bottom: 1.5rem;
    }
    .mt-4 {
        margin-top: 1.5rem;
    }
</style>
