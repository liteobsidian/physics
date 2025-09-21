<template>
    <v-app>
        <div class="editor-layout">
            <v-btn
                class="clickable"
                icon="mdi-arrow-left"
                variant="text"
                color="black"
                style="text-transform: none"
                @click="toProfile"
            ></v-btn>
            <div class="editor-header-wrapper mb-10">
                <div class="editor-header-title">
                    <div style="align-items: center; flex-direction: column" class="d-flex">
                        <v-icon color="#4285f4" size="48">mdi-flask </v-icon>
                        <h2>Добро пожаловать в редактор!</h2>
                    </div>
                    <p class="header-text">
                        В редакторе вы можете добавлять новые задания, изменять уже сеществующие и удалять их. Также эти
                        функции распространяются к тэгам, блокам и темам
                    </p>
                </div>
            </div>
            <div class="menu-container d-flex flex-column ga-lg-8">
                <div class="d-flex justify-space-around">
                    <v-btn color="primary" width="200px" :disabled="isBtnDisabled('exercise')">
                        Задания
                        <v-menu activator="parent">
                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :value="index"
                                    @click="(selectMenuOption('exercise', item.action), (activeEditor = 'exercise'))"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
                    <v-btn color="primary" width="200px" :disabled="isBtnDisabled('tag')">
                        Тэги
                        <v-menu activator="parent">
                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in tagOptions"
                                    :key="index"
                                    :value="index"
                                    @click="(selectMenuOption('tag', item.action), (activeEditor = 'tags'))"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
                    <v-btn color="primary" width="200px" :disabled="isBtnDisabled('topic')">
                        Темы
                        <v-menu activator="parent">
                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :value="index"
                                    @click="(selectMenuOption('topic', item.action), (activeEditor = 'topic'))"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>

                    <v-btn color="primary" width="200px" :disabled="isBtnDisabled('block')">
                        Блоки
                        <v-menu activator="parent">
                            <v-list>
                                <v-list-item
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :value="index"
                                    @click="(selectMenuOption('block', item.action), (activeEditor = 'block'))"
                                >
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
                </div>
            </div>
            <div class="editor-space">
                <div class="editor-contet">
                    <!-- EXERCISES -->
                    <add-exercise-form
                        v-if="selectedExerciseOption === 'add'"
                        v-model:selectedExerciseOption="selectedExerciseOption"
                        :topics="topics"
                        :taskTypes="taskTypes"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />
                    <edit-exercise-form
                        v-if="selectedExerciseOption === 'edit'"
                        v-model:selectedExerciseOption="selectedExerciseOption"
                        :exercises="exercises"
                        :topics="topics"
                        :taskTypes="taskTypes"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />
                    <delete-exercise-form
                        v-if="selectedExerciseOption === 'delete'"
                        v-model:selectedExerciseOption="selectedExerciseOption"
                        :exercises="exercises"
                        :topics="topics"
                        :types="taskTypes"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />

                    <!-- TAGS -->
                    <add-tag-form
                        v-if="selectedTagOption === 'add'"
                        v-model:selectedTagOption="selectedTagOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />
                    <edit-tag-form
                        v-if="selectedTagOption === 'edit'"
                        v-model:selectedTagOption="selectedTagOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :tags="tags"
                    />
                    <delete-tag-form
                        v-if="selectedTagOption === 'delete'"
                        v-model:selectedTagOption="selectedTagOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :tags="tags"
                    />
                    <connect-tag-with-topic-form
                        v-if="selectedTagOption === 'connect'"
                        v-model:selectedTagOption="selectedTagOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :topics="topics"
                        :tags="tags"
                    />
                    <!-- TOPICS -->
                    <add-topic-form
                        v-if="selectedTopicOption === 'add'"
                        v-model:selectedTopicOption="selectedTopicOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :blocks="blocks"
                    />
                    <edit-topic-form
                        v-if="selectedTopicOption === 'edit'"
                        v-model:selectedTopicOption="selectedTopicOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :topics="topics"
                    />
                    <delete-topic-form
                        v-if="selectedTopicOption === 'delete'"
                        v-model:selectedTopicOption="selectedTopicOption"
                        :topics="topics"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />

                    <!-- BLOCKS -->
                    <add-block-form
                        v-if="selectedBlockOption === 'add'"
                        v-model:selectedBlockOption="selectedBlockOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />
                    <edit-block-form
                        v-if="selectedBlockOption === 'edit'"
                        v-model:selectedBlockOption="selectedBlockOption"
                        :blocks="blocks"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                    />
                    <delete-block-form
                        v-if="selectedBlockOption === 'delete'"
                        v-model:selectedBlockOption="selectedBlockOption"
                        :successEditingTask="successEditingTask"
                        @update:successEditingTask="t => Object.assign(successEditingTask, t)"
                        :errorEditingTask="errorEditingTask"
                        @update:errorEditingTask="t => Object.assign(errorEditingTask, t)"
                        :getData="getData"
                        :blocks="blocks"
                    />
                </div>
            </div>
        </div>
        <v-snackbar v-model="successEditingTask.show" color="green" location="top" :timeout="2000">
            {{ successEditingTask.text }}
        </v-snackbar>
        <v-snackbar v-model="errorEditingTask.show" color="error" location="top" :timeout="4000">
            {{ errorEditingTask.text }}
        </v-snackbar>
    </v-app>
</template>
<script setup>
    import AddExerciseForm from '@/components/admin-components/exercise-components/AddExerciseForm.vue'
    import EditExerciseForm from '@/components/admin-components/exercise-components/EditExerciseForm.vue'
    import DeleteExerciseForm from '@/components/admin-components/exercise-components/DeleteExerciseForm.vue'
    import AddBlockForm from '@/components/admin-components/block-components/AddBlockForm.vue'
    import EditBlockForm from '@/components/admin-components/block-components/EditBlockForm.vue'
    import DeleteBlockForm from '@/components/admin-components/block-components/DeleteBlockForm.vue'
    import AddTagForm from '@/components/admin-components/tag-components/AddTagForm.vue'
    import EditTagForm from '@/components/admin-components/tag-components/EditTagForm.vue'
    import DeleteTagForm from '@/components/admin-components/tag-components/DeleteTagForm.vue'
    import AddTopicForm from '@/components/admin-components/topic-components/AddTopicForm.vue'
    import EditTopicForm from '@/components/admin-components/topic-components/EditTopicForm.vue'
    import DeleteTopicForm from '@/components/admin-components/topic-components/DeleteTopicForm.vue'
    import ConnectTagWithTopicForm from '@/components/admin-components/tag-components/ConnectTagWithTopicForm.vue'
    import { ref, watch, reactive, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import dataService from '@/services/data.service'
    import '@/assets/main.css'

    const selectedExerciseOption = ref(null)
    const selectedTagOption = ref(null)
    const selectedBlockOption = ref(null)
    const selectedTopicOption = ref(null)

    const successEditingTask = reactive({ show: false, text: '' })
    const errorEditingTask = reactive({ show: false, text: '' })

    function selectMenuOption(type, action) {
        if (type === 'exercise') selectedExerciseOption.value = action
        if (type === 'tag') selectedTagOption.value = action
        if (type === 'topic') selectedTopicOption.value = action
        if (type === 'block') selectedBlockOption.value = action
    }

    const router = useRouter()

    const toProfile = () => {
        router.back()
    }

    const taskTypes = [
        { type: 'study', title: 'Изучение' },
        { type: 'check', title: 'Упражнение' },
        { type: 'repetition', title: 'Повторение' },
    ]

    const options = [
        { title: 'Добавить', action: 'add' },
        { title: 'Изменить', action: 'edit' },
        { title: 'Удалить', action: 'delete' },
    ]

    const tagOptions = [
        { title: 'Связать', action: 'connect' },
        { title: 'Добавить', action: 'add' },
        { title: 'Изменить', action: 'edit' },
        { title: 'Удалить', action: 'delete' },
    ]

    const exercises = ref({ study: null, check: null, repetition: null })

    const topics = ref([])

    const tags = ref([])

    const blocks = ref([])

    const activeEditor = ref(null)

    function onOptionChange(type, val) {
        if (val) activeEditor.value = type
        else activeEditor.value = null
    }

    watch(selectedExerciseOption, val => onOptionChange('exercise', val))
    watch(selectedTagOption, val => onOptionChange('tag', val))
    watch(selectedTopicOption, val => onOptionChange('topic', val))
    watch(selectedBlockOption, val => onOptionChange('block', val))

    const isBtnDisabled = type => activeEditor.value && activeEditor.value !== type

    async function getData() {
        const data = await dataService.getBulk({
            exercises: 'getExercises',
            topics: 'getTopics',
            tags: 'getTags',
            blocks: 'getBlocks',
        })

        exercises.value = {
            study: Object.values(data.exercises.study.data),
            check: Object.values(data.exercises.check.data),
            repetition: Object.values(data.exercises.repetition.data),
        }
        topics.value = data.topics.data
        tags.value = data.tags.data
        blocks.value = data.blocks
    }

    onMounted(async () => {
        await getData()
    })
</script>
<style lang="scss" scoped>
    .editor-layout {
        width: 100%;
        padding: 2rem;
    }
    .editor-header-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .header-text {
        width: 75%;
        text-align: center;
    }
    .editor-header-title {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: #d7d7d7 solid 1px;
        padding: 1rem;
    }
    h2 {
        color: #4285f4;
    }
    .editor-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 250px;
        padding: 2.5rem;
        border-radius: 8px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(117, 90, 90, 0.1);
    }
    .editor-space {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 3rem;
    }
    .editor-contet {
        min-width: 70%;
    }
    .menu-container {
        padding: 2.5rem;
        border-radius: 8px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
</style>
