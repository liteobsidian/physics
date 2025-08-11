<template>
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
                <v-btn color="#4285f4" width="30%">Изменить пароль</v-btn>
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
                >{{ studyProgress }} / {{ studyExercisesQuantity }}</v-progress-linear
            >
            <br />
            <p>Упражнения</p>
            <v-progress-linear
                bg-color="#0f9d58"
                color="#0f9d58"
                :model-value="checkProgress"
                :height="25"
                style="border-radius: 8px"
                >{{ checkProgress }} / {{ repetitionExercisesQuantity }}</v-progress-linear
            >
            <br />
            <p>Упражнения на повторение</p>
            <v-progress-linear
                bg-color="#0f9d58"
                color="#0f9d58"
                :model-value="checkProgress"
                :height="25"
                style="border-radius: 8px"
                >{{ repetitionProgress }} / {{ checkExercisesQuantity }}</v-progress-linear
            >
        </div>
        <v-btn @click="onLogOut" color="#4285f4" width="30%">Выйти из аккаунта</v-btn>
    </div>
    <div v-else-if="isLogin && userRole === 'admin'" class="profile-container">
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
                <v-btn color="#4285f4" width="30%">Изменить пароль</v-btn>
            </div>
        </div>
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
    <v-snackbar v-model="success.show" color="green" location="top" :timeout="2000">
        {{ success.text }}
    </v-snackbar>
</template>

<script setup>
    import { onMounted, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { getUserInfo, logOut, getCompletedTasks } from '@/services/api.service'
    import DataService from '../services/data.service'
    import { useProgress } from '@/services/useProgress.service'

    const { progress } = useProgress()

    const router = useRouter()

    const username = ref('')
    const email = ref('')
    const userId = ref(null)
    const noLogin = ref(false)
    const checkExercisesQuantity = ref(null)
    const studyExercisesQuantity = ref(null)
    const repetitionExercisesQuantity = ref(null)
    const isLogin = ref(false)
    const userRole = ref('')

    const success = ref({ show: false, text: '' })

    const onLogOut = async () => {
        const response = await logOut()
        if (response.status === 200) {
            progress.value = []
            router.push('/')
        }
    }

    const getData = async () => {
        try {
            const userProgressResponse = await getCompletedTasks()
            const data = await DataService.getBulk({
                exercises: 'getExercises',
            })
            const response = await getUserInfo()
            if (response.status === 200) {
                isLogin.value = true
                userRole.value = response.data.user.role
            }

            progress.value = userProgressResponse.data

            checkExercisesQuantity.value = Object.keys(data.exercises.check).length
            studyExercisesQuantity.value = Object.keys(data.exercises.study).length
            repetitionExercisesQuantity.value = Object.keys(data.exercises.repetition).length

            username.value = response.data.user.username
            userId.value = response.data.user.id
            email.value = response.data.user.email
        } catch (error) {
            if (error.response.status === 403) {
                noLogin.value = true
            }
        }
    }

    let studyProgress = computed(() => progress.value.filter(item => item.exercise_type === 'study').length)
    let checkProgress = computed(() => progress.value.filter(item => item.exercise_type === 'check').length)
    let repetitionProgress = computed(() => progress.value.filter(item => item.exercise_type === 'repetition').length)

    onMounted(async () => {
        await getData()
        const msg = sessionStorage.getItem('profileSuccess')
        if (msg) {
            success.value = { show: true, text: msg }
            sessionStorage.removeItem('profileSuccess')
        }
    })
</script>

<style lang="scss" scoped>
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
</style>
