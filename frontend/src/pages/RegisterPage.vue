<template>
    <v-sheet class="register-block">
        <h1>Регистрация</h1>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field label="Имя пользователя" v-model="username" :rules="usernameRules"></v-text-field>
            <v-text-field label="Почта" v-model="email" :rules="emailRules" type="email"></v-text-field>
            <v-text-field label="Пароль" :rules="passwordRules" v-model="password"></v-text-field>
            <v-text-field
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
        <v-snackbar v-model="snackbar.show" color="green" location="top">
            {{ snackbar.text }}
        </v-snackbar>
        <v-snackbar v-model="error.show" color="red" location="top">
            {{ error.text }}
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
    const snackbar = ref({ show: false, text: '' })
    const error = ref({ show: false, text: '' })

    const usernameRules = [v => !!v || 'Введите имя пользователя', v => v.length >= 3 || 'Минимум 3 символа']

    const emailRules = [v => !!v || 'Введите почту', v => /.+@.+\..+/.test(v) || 'Некорректный email']

    const passwordRules = [v => !!v || 'Введите пароль', v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов']

    const confirmPasswordRules = [v => !!v || 'Повторите пароль', v => v === password.value || 'Пароли не совпадают']

    const toLogin = () => {
        router.push('/login')
    }

    async function onSubmit() {
        const isValid = await form.value.validate()
        if (!isValid) return

        try {
            await register(username.value, email.value, password.value)
            snackbar.value = {
                show: true,
                text: 'Регистрация прошла успешно! На вашу почту отправлено письмо с подтверждением регистрации.',
            }
        } catch (err) {
            console.error('Ошибка регистрации', err)
            error.value = { show: true, text: 'Ошибка регистрации. Попробуйте снова.' }
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
