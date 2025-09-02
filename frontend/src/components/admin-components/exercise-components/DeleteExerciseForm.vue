    <template >
        <div    class="admin-delete-task">
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
                                >ID: {{ props.task.id }}</span
                            >
                        </div>
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
                        </div>
                        <v-textarea
                            v-else
                            :model-value="props.task.taskText"
                            auto-grow
                            readonly=true
                        ></v-textarea>
                    </div>
                    <div>
                        <span style="color: #4285f4; font-weight: bold">Подсказка</span>
                        <div
                            v-if="isImage(props.task.hintText)"
                            style="display: flex; justify-content: center; flex-direction: column; gap: 1rem"
                        >
                            <img
                                :src="newHintImgUrl || base64Decode(props.task.hintText)"
                                style="max-width: 100%; border-radius: 8px"
                            />    
                        </div>

                        <v-textarea
                            v-else
                            :model-value="props.task.hintText"
                            auto-grow
                            readonly=true
                        ></v-textarea>
                    </div>
                </div>
                <div class="mt-4">
                    <span style="color: #4285f4; font-weight: bold">Ответ</span>
                    <v-text-field
                        :model-value="props.task.answer"
                        autocomple="off"
                        readonly=true
                    ></v-text-field>
                </div>
                <div class="d-flex" style="justify-content: space-between;">
                <v-btn @click="deleteTask(), $emit('update:editorMode', null), cleanFields" color="#4285f4">
                    Удалить задание
                </v-btn>
                <v-btn @click="$emit('update:editorMode', null), cleanFields()">Отмена</v-btn>
                </div>
        
            </div>
        </div>
    </template>
    <script setup>
    import { defineProps, computed, ref, defineEmits, watch} from 'vue';
    const props = defineProps({
        exercises: Array,
        topics: Array,
        types: Array,
        onDeleteTask: Boolean,
        cleanFields: Function,
        task: { type: Object, default: () => ({}) },
        deleteTask: Function
    })

    const selectedTopic = ref(null)
    const selectedType = ref(null)
    const selectedExercise =ref(null)

    const filteredExercises = computed(() => {
        let exercises = props.exercises?.[selectedType.value?.type] ?? []
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

    const emit = defineEmits(['update:task', 'update:editorMode'])

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

    watch(selectedType, type => {
        if(!type) return
        emit('update:task', {
            ...props.task,
            taskType: type
        })
    })

    watch(selectedExercise, exercise =>{
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


    </script>
    <style lang="scss" scoped>
        .admin-delete-task {
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