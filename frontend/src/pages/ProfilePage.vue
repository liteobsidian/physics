<template>
    <v-progress-circular v-if="isLoading" indeterminate color="primary" size="48" class="d-flex mx-auto my-8" />
    <div v-else>
        <div v-if="isLogin && userRole === 'user'" class="profile-container">
            <div class="d-flex justify-center flex-column editor-container">
                <div class="profile-header">
                    <p>Профиль</p>
                </div>
                <div class="d-flex ga-3" style="flex-direction: column">
                    <div class="d-flex" style="justify-content: space-between">
                        <h3>Ученик {{ username }}</h3>
                    </div>
                    <div class="d-flex" style="justify-content: space-between">
                        <h3>Элеткронная почта: {{ email }}</h3>
                    </div>
                    <v-btn color="#4285f4" width="30%" @click="toChangePassword">Изменить пароль</v-btn>
                </div>
            </div>
        </div>
        <div v-else-if="isLogin && userRole === 'admin'" class="profile-container">
            <div class="d-flex justify-center flex-column editor-container">
                <div class="profile-header">
                    <p>Добро пожаловать в админ панель!</p>
                </div>
                <div class="d-flex ga-3" style="flex-direction: column">
                    <div class="d-flex" style="justify-content: space-between">
                        <h3>Админ {{ username }}</h3>
                    </div>
                    <div class="d-flex" style="justify-content: space-between">
                        <h3>Элеткронная почта: {{ email }}</h3>
                    </div>
                    <v-btn color="#4285f4" width="30%" @click="toChangePassword">Изменить пароль</v-btn>
                    <div class="admin-actions">
                        <v-btn color="#4285f4" width="30%" @click="toAdmins">Добавить админа</v-btn>
                        <v-btn color="#4285f4" width="30%" @click="toEditor">Открыть редактор</v-btn>
                    </div>
                </div>
            </div>
            <div class="editor-container">
                <h3 class="user-stats-header">Статистика сайта</h3>
                <div>
                    <h3>
                        Пользователей на сайте: <span class="editor-font">{{ usersQuntity }}</span>
                    </h3>
                </div>
                <div>
                    <div>
                        <div class="subtitle">
                            <h3 class="text-start">Учебный материал</h3>
                        </div>
                        <p class="text-start editor-font mb-4 mt-2">Всего заданий: {{ exercisesSum }}</p>
                    </div>
                    <div class="d-flex ga-md-16 justify-sm-center">
                        <div class="diagram-container">
                            <p>Изучение: {{ studyValue }}</p>
                            <v-progress-circular
                                color="primary"
                                :model-value="Math.ceil((studyValue / exercisesSum) * 100)"
                                :width="15"
                                :size="100"
                            >
                                <span>{{ Math.ceil((studyValue / exercisesSum) * 100) }} % </span>
                            </v-progress-circular>
                        </div>

                        <div class="diagram-container">
                            <p class="stat-text">Упражнения: {{ checkValue }}</p>
                            <v-progress-circular
                                color="primary"
                                :model-value="Math.ceil((studyValue / exercisesSum) * 100)"
                                :width="15"
                                :size="100"
                            >
                                <span>{{ Math.ceil((checkValue / exercisesSum) * 100) }} % </span>
                            </v-progress-circular>
                        </div>

                        <div class="diagram-container">
                            <p>Повторение: {{ repetitionValue }}</p>
                            <v-progress-circular
                                color="primary"
                                :model-value="Math.ceil((repetitionValue / exercisesSum) * 100)"
                                :width="15"
                                :size="100"
                            >
                                <span>{{ Math.ceil((repetitionValue / exercisesSum) * 100) }} % </span>
                            </v-progress-circular>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-stats">
            <div class="user-stats-header">
                <p>Статистика по выполнению заданий</p>
            </div>
            <p>Изучение</p>
            <v-progress-linear
                bg-color="#0f9d58"
                color="#0f9d58"
                :model-value="studyProgress"
                :height="25"
                style="border-radius: 8px"
                >{{ studyProgress }} / {{ studyValue }}</v-progress-linear
            >
            <br />
            <p>Упражнения</p>
            <v-progress-linear
                bg-color="#0f9d58"
                color="#0f9d58"
                :model-value="checkProgress"
                :height="25"
                style="border-radius: 8px"
                >{{ checkProgress }} / {{ checkValue }}</v-progress-linear
            >
            <br />
            <p>Упражнения на повторение</p>
            <v-progress-linear
                bg-color="#0f9d58"
                color="#0f9d58"
                :model-value="checkProgress"
                :height="25"
                style="border-radius: 8px"
                >{{ repetitionProgress }} / {{ repetitionValue }}</v-progress-linear
            >
        </div>
        <v-btn @click="onLogOut" color="#4285f4" width="30%" class="mt-12">Выйти из аккаунта</v-btn>
    </div>

    <v-snackbar v-model="success.show" color="green" location="top" :timeout="2000">
        {{ success.text }}
    </v-snackbar>
    <v-snackbar v-model="successPassword.show" color="green" location="top" :timeout="2000">
        {{ successPassword.text }}
    </v-snackbar>
</template>

<script setup>
    import { onMounted, ref, computed, reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { getUserInfo, logOut, getCompletedTasks } from '@/services/api.service'
    import { useProgress } from '@/services/useProgress.service'
    import { userStorage, dataStorage } from '@/plugins/pinia'
    import { getUsers } from '@/services/admin.service'
    import '@/assets/main.css'

    const userStore = userStorage()
    const dataStore = dataStorage()

    const { progress } = useProgress()

    const router = useRouter()

    const isLoading = ref(false)
    const username = ref('')
    const email = ref('')
    const userId = ref(null)
    const isLogin = ref(false)
    const userRole = ref('')

    const checkExerciseData = computed(() => dataStore.exercises.check)
    const studyExerciseData = computed(() => dataStore.exercises.study)
    const repetitionExerciseData = computed(() => dataStore.exercises.repetition)

    const users = ref([])

    const topics = computed(() => dataStore.topics)

    const tags = computed(() => dataStore.tags)

    const success = ref({ show: false, text: '' })
    const successPassword = ref({ show: false, text: '' })

    const exercisesSum = computed(
        () =>
            Object.keys(studyExerciseData.value).length +
            Object.keys(checkExerciseData.value).length +
            Object.keys(repetitionExerciseData.value).length,
    )

    const studyValue = computed(() => Object.keys(studyExerciseData.value).length)
    const checkValue = computed(() => Object.keys(checkExerciseData.value).length)
    const repetitionValue = computed(() => Object.keys(repetitionExerciseData.value).length)

    const usersQuntity = computed(() => Object.keys(users.value).length)

    const onLogOut = async () => {
        const response = await logOut()
        if (response.status === 200) {
            progress.value = []
            userStore.userProgress = []
            userStore.$reset()
            router.push('/')
        }
    }

    const toChangePassword = () => {
        router.push({ name: 'change-password' })
    }
    const toEditor = () => {
        router.push({ name: 'editor' })
    }
    const toAdmins = () => {
        router.push({ name: 'add-admin' })
    }

    const getData = async () => {
        isLoading.value = true
        try {
            const response = await getUserInfo()
            if (response.status === 200) {
                isLogin.value = true
                userRole.value = response.data.user.role
            }

            if (userStore.role === 'admin') {
                const res = await getUsers()
                users.value = res.data
            }

            username.value = response.data.user.username
            userId.value = response.data.user.id
            email.value = response.data.user.email
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    let studyProgress = computed(() => progress.value.filter(item => item.exercise_type === 'study').length)
    let checkProgress = computed(() => progress.value.filter(item => item.exercise_type === 'check').length)
    let repetitionProgress = computed(() => progress.value.filter(item => item.exercise_type === 'repetition').length)

    onMounted(async () => {
        await getData()
        await userStore.updateCompletedTask()

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
    .admin-actions {
        display: flex;
        justify-content: space-between;
    }
    .diagram-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 300px;
        max-width: 500px;
    }
    .subtitle {
        border-bottom: #d7d7d7 solid 1px;
    }
</style>
