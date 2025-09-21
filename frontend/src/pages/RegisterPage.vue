<template>
    <v-sheet class="register-block">
        <h1>Регистрация</h1>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field
                label="Имя пользователя"
                v-model="username"
                :rules="usernameRules"
                :type="'username'"
            ></v-text-field>
            <v-text-field label="Почта" v-model="email" :rules="emailRules" :type="'email'"></v-text-field>
            <v-text-field label="Пароль" :rules="passwordRules" v-model="password"></v-text-field>
            <v-text-field
                :type="'password'"
                label="Повторите пароль"
                :rules="confirmPasswordRules"
                v-model="confirmPassword"
                @cut.prevent
                @copy.prevent
                @paste.prevent
            ></v-text-field>
            <v-btn type="submit" class="button">Зарегистрироваться</v-btn>
            <div class="d-flex login">
                <span>Если у вас уже есть аккаунт</span>
                <v-btn @click="toLogin" class="button">Войти</v-btn>
            </div>
        </v-form>

        <v-snackbar v-model="errorSnackbar.show" color="red" location="top">
            {{ errorSnackbar.text }}
        </v-snackbar>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { register } from '@/services/api.service'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const form = ref(null)

    const password = ref('')
    const confirmPassword = ref('')
    const username = ref('')
    const email = ref('')
    const errorSnackbar = ref({ show: false, text: '' })

    const usernameRules = [v => !!v || 'Введите имя пользователя', v => v.length >= 3 || 'Минимум 3 символа']

    const emailRules = [v => !!v || 'Введите почту', v => /.+@.+\..+/.test(v) || 'Некорректный email']

    const passwordRules = [v => !!v || 'Введите пароль', v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов']

    const confirmPasswordRules = [v => !!v || 'Повторите пароль', v => v === password.value || 'Пароли не совпадают']

    const toLogin = () => {
        router.push('/login')
    }

    async function onSubmit() {
        const { valid } = await form.value.validate()
        if (!valid) return

        try {
            const response = await register(username.value, email.value, password.value)
            if (response.status === 200) router.push({ name: 'email-send' })
        } catch (err) {
            const { error, errorDescription } = err.response.data
            if (error === 'SequelizeUniqueConstraintError') {
                if (String(errorDescription).includes('email')) {
                    errorSnackbar.value = { show: true, text: 'Пользователь с такой почтой уже существует' }
                } else if (String(errorDescription).includes('login')) {
                    errorSnackbar.value = { show: true, text: 'Пользователь с таким именем уже существует' }
                }
            } else {
                errorSnackbar.value = { show: true, text: 'Ошибка сервера' }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .register-block {
        display: flex;
        justify-content: center;
        padding: 5rem;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 70%;
    }
    .button {
        align-self: center;
        background-color: #4285f4 !important;
        color: #ffff;
        width: 80%;
    }
    .login {
        justify-content: center;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem;
        border-top: solid 1px #a4a4a4;
        margin-top: 1rem;
    }
</style>
