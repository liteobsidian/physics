<template>
    <v-progress-circular v-if="isLoading" indeterminate color="primary" size="48" class="d-flex mx-auto my-8" />
    <div v-else>
        <div v-if="isLogin && userRole === 'user'" class="profile-container">
            <div class="d-flex justify-center flex-column profile-info">
                <div class="profile-header">
                    <p>Профиль</p>
                </div>
                <div class="d-flex ga-3" style="flex-direction: column">
                    <div class="d-flex" style="justify-content: space-between">
                        <p>Ученик {{ username }}</p>
                    </div>
                    <div class="d-flex" style="justify-content: space-between">
                        <p>Элеткронная почта: {{ email }}</p>
                    </div>
                    <v-btn color="#4285f4" width="30%" @click="toChangePassword">Изменить пароль</v-btn>
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stats-header">
                    <p>Статистика</p>
                </div>
                <p>Изучение</p>
                <v-progress-linear
                    bg-color="#0f9d58"
                    color="#0f9d58"
                    :model-value="studyProgress"
                    :height="25"
                    style="border-radius: 8px"
                    >{{ studyProgress }} / {{ Object.keys(exercises.study).length }}</v-progress-linear
                >
                <br />
                <p>Упражнения</p>
                <v-progress-linear
                    bg-color="#0f9d58"
                    color="#0f9d58"
                    :model-value="checkProgress"
                    :height="25"
                    style="border-radius: 8px"
                    >{{ checkProgress }} / {{ Object.keys(exercises.check).length }}</v-progress-linear
                >
                <br />
                <p>Упражнения на повторение</p>
                <v-progress-linear
                    bg-color="#0f9d58"
                    color="#0f9d58"
                    :model-value="checkProgress"
                    :height="25"
                    style="border-radius: 8px"
                    >{{ repetitionProgress }} / {{ Object.keys(exercises.repetition).length }}</v-progress-linear
                >
            </div>
            <v-btn @click="onLogOut" color="#4285f4" width="30%">Выйти из аккаунта</v-btn>
        </div>
        <div v-else-if="isLogin && userRole === 'admin'" class="profile-container">
            <div class="d-flex justify-center flex-column profile-info">
                <div class="profile-header">
                    <p>Добро пожаловать в админ панель!</p>
                </div>
                <div class="d-flex ga-3" style="flex-direction: column">
                    <div class="d-flex" style="justify-content: space-between">
                        <p>Админ {{ username }}</p>
                    </div>
                    <div class="d-flex" style="justify-content: space-between">
                        <p>Элеткронная почта: {{ email }}</p>
                    </div>
                    <v-btn color="#4285f4" width="30%" @click="toChangePassword">Изменить пароль</v-btn>
                    <v-btn color="#4285f4" width="30%">Добавить админа</v-btn>
                </div>
            </div>
            <v-btn @click="onOpenTaskEditor = !onOpenTaskEditor">Редактор заданий</v-btn>
            <div v-show="onOpenTaskEditor" class="editor-buttons">
                <v-btn width="70%" @click="onAddTaskEditor = !onAddTaskEditor">Добавить задание</v-btn>
                <v-btn width="70%" @click="onAddEditExistingTask = !onAddEditExistingTask" v-show="!onAddTaskEditor"
                    >Измениеть задание</v-btn
                >
                <v-btn width="70%" v-show="!onAddTaskEditor">Удалить задание</v-btn>
            </div>
            <ExerciseEditorFrom
                v-show="onAddTaskEditor"
                v-model:taskText="taskText"
                v-model:taskAnswer="taskAnswer"
                v-model:taskHintText="taskHintText"
                :topics="topics"
                :taskTypes="taskTypes"
                v-model:selectedTaskType="selectedTaskType"
                v-model:selectedTopic="selectedTopic"
                :addTask="addTask"
                v-model:onAddTaskEditor="onAddTaskEditor"
                v-model:taskImgBuffer="taskImgBuffer"
                v-model:taskHintImgBuffer="taskHintImgBuffer"
            />
            <EditExistingExerciseForm
                v-show="onAddEditExistingTask"
                v-model:onAddEditExistingTask="onAddEditExistingTask"
                :exercises="exercises"
                :topics="topics"
                :taskTypes="taskTypes"
            />
            <v-btn>Редактор тэгов</v-btn>
            <v-btn>Редактор тем</v-btn>

            <v-btn @click="onLogOut" color="#4285f4" width="30%">Выйти из аккаунта</v-btn>
        </div>
        <div v-else class="container">
            <div v-if="noLogin" class="auth-container">
                <div class="title">
                    <v-icon color="primary" size="64">mdi-flask</v-icon>
                    <p class="text">Зарегистрируйтесь или войдите, если у вас уже есть аккаунт.</p>
                </div>
                <v-btn class="button" @click="router.push('/login')">ВОЙТИ</v-btn>
                <v-btn class="button" @click="router.push('/register')">ЗАРЕГИСТРИРОВАТЬСЯ</v-btn>
            </div>
        </div>
    </div>

    <v-snackbar v-model="success.show" color="green" location="top" :timeout="2000">
        {{ success.text }}
    </v-snackbar>
    <v-snackbar v-model="successPassword.show" color="green" location="top" :timeout="2000">
        {{ successPassword.text }}
    </v-snackbar>
    <v-snackbar v-model="successAddedTask.show" color="green" location="top" :timeout="2000">
        {{ successAddedTask.text }}
    </v-snackbar>
    <v-snackbar v-model="errorAddedTask.show" color="error" location="top" :timeout="2000">
        {{ errorAddedTask.text }}
    </v-snackbar>
</template>

<script setup>
    import { onMounted, ref, computed, watch, defineOptions } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { getUserInfo, logOut, getCompletedTasks } from '@/services/api.service'
    import DataService from '../services/data.service'
    import { useProgress } from '@/services/useProgress.service'
    import api from '@/services/api.service'
    import { addTaskAdmin, editTaskAdmin } from '@/services/admin.service.js'
    import ExerciseEditorFrom from '@/components/admin-components/exercise-components/ExerciseEditorForm.vue'
    import EditExistingExerciseForm from '@/components/admin-components/exercise-components/EditExistingExerciseForm.vue'

    const { progress } = useProgress()

    const router = useRouter()

    const isLoading = ref(false)
    const username = ref('')
    const email = ref('')
    const userId = ref(null)
    const noLogin = ref(false)
    const isLogin = ref(false)
    const userRole = ref('')

    const exercises = ref({ study: null, check: null, repetition: null })

    const topics = ref([])

    const tags = ref([])
    const selectedTag = ref([])

    const taskTypes = [
        { type: 'study', title: 'Изучение' },
        { type: 'check', title: 'Упражнение' },
        { type: 'repetition', title: 'Повторение' },
    ]
    const selectedTaskType = ref(null)

    const onOpenTaskEditor = ref(false)
    const onAddTaskEditor = ref(false)

    const taskImgBuffer = ref('')
    const taskText = ref('')
    const selectedTopic = ref(null)
    const taskAnswer = ref('')
    const taskHintText = ref('')
    const taskHintImgBuffer = ref('')

    const onOpenEditExistingTask = ref(false)
    const onAddEditExistingTask = ref(false)

    const onOpenDeleteTask = ref(false)
    const onDeleteTask = ref(false)

    const success = ref({ show: false, text: '' })
    const successPassword = ref({ show: false, text: '' })
    const successAddedTask = ref({ show: false, text: '' })
    const errorAddedTask = ref({ show: false, text: '' })

    async function addTask() {
        try {
            const responese = await addTaskAdmin(
                !taskImgBuffer.value ? taskText.value : taskImgBuffer.value,
                taskAnswer.value,
                !taskHintImgBuffer.value ? taskHintText.value : taskHintImgBuffer.value,
                Number(selectedTopic.value.id),
                selectedTaskType.value.type,
            )
            if (responese?.status == 201) {
                successAddedTask.value = { show: true, text: 'Задание успешно добавлено!' }
                taskImgBuffer.value = null
                taskText.value = null
                taskAnswer.value = null
                taskHintImgBuffer.value = null
                taskHintText.value = null
                selectedTopic.value = null
                selectedTaskType.value = null
                return
            }
        } catch (error) {
            errorAddedTask.value = { show: true, text: `Ошибка: ${error}. Задание не добавлено` }
            console.log(error)
            return
        }
    }

    async function editTask() {}

    const onLogOut = async () => {
        const response = await logOut()
        if (response.status === 200) {
            progress.value = []
            localStorage.removeItem('userProgress')
            localStorage.removeItem('startDate')
            window.dispatchEvent(new Event('reset-days'))
            router.push('/')
        }
    }

    const toChangePassword = async () => {
        router.push({ name: 'change-password' })
    }

    const getData = async () => {
        isLoading.value = true
        try {
            const userProgressResponse = await getCompletedTasks()
            const data = await DataService.getBulk({
                exercises: 'getExercises',
                topics: 'getTopics',
                tags: 'getTags',
            })
            const response = await getUserInfo()
            if (response.status === 200) {
                isLogin.value = true
                userRole.value = response.data.user.role
            }

            progress.value = userProgressResponse.data
            localStorage.setItem('userProgress', JSON.stringify(userProgressResponse.data))

            exercises.value = {
                study: Object.values(data.exercises.study),
                check: Object.values(data.exercises.check),
                repetition: Object.values(data.exercises.repetition),
            }

            topics.value = data.topics.data

            tags.value = data.tags.data

            username.value = response.data.user.username
            userId.value = response.data.user.id
            email.value = response.data.user.email
        } catch (error) {
            if (error.response?.status === 401) {
                window.location.href = 'http://localhost:5173/physics/#/login'
                return
            }
        } finally {
            isLoading.value = false
        }
    }

    let studyProgress = computed(() => progress.value.filter(item => item.exercise_type === 'study').length)
    let checkProgress = computed(() => progress.value.filter(item => item.exercise_type === 'check').length)
    let repetitionProgress = computed(() => progress.value.filter(item => item.exercise_type === 'repetition').length)

    onMounted(async () => {
        await getData()
        const msg = sessionStorage.getItem('profileSuccess')
        const passwordMsg = sessionStorage.getItem('changePasswordSuccess')
        if (msg) {
            success.value = { show: true, text: msg }
            sessionStorage.removeItem('profileSuccess')
        }
        if (passwordMsg) {
            successPassword.value = { show: true, text: passwordMsg }
            sessionStorage.removeItem('changePasswordSuccess')
        }
    })
</script>

<style lang="scss" scoped>
    .tag-group {
        flex-wrap: wrap;
        max-height: 180px;
        overflow-y: auto;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        box-sizing: border-box;
        margin-top: 25%;
    }

    .auth-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e0e0e0;
    }

    .text {
        text-align: center;
        margin: 0;
        color: #424242;
        font-size: 1rem;
    }

    .button {
        width: 100%;
        background-color: #4285f4 !important;
        color: white !important;
        font-weight: bold;
        text-transform: uppercase;
        padding: 12px 0;
        font-size: 0.875rem;
    }
    .profile-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        max-width: 1280px;
        margin: 2rem auto;
        width: 100%;
    }
    .profile-info {
        margin-bottom: auto;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        display: flex;
        justify-content: baseline;
        padding: 2rem;
        font-size: large;
        font-weight: bold;
        letter-spacing: 0.05rem;
        margin-top: 2rem;
        gap: 1rem;
    }
    .user-stats {
        background-color: #f5f5f5;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .user-stats-header {
        margin-bottom: 2rem;
        text-align: center;
        font-size: 1.5rem;
        border-bottom: solid 1px #d7d7d7;
        color: #4285f4;
    }
    .profile-header {
        font-size: 1.5rem;
        text-align: center;
        border-bottom: solid 1px #d7d7d7;
        color: #4285f4;
    }
    :deep(.editor-buttons) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }
</style>
