<template>
    <v-sheet class="register-block">
        <h1>Вход</h1>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field label="Почта" v-model="email" :rules="emailRules" type="email"></v-text-field>
            <v-text-field label="Пароль" :rules="passwordRules" v-model="password"></v-text-field>
            <v-btn type="submit" class="button">Войти</v-btn>
            <div class="d-felx register">
                <span>Если у вас ещё нет аккаунта</span>
                <v-btn @click="toRegister" class="button">Зарегистрироваться</v-btn>
            </div>
        </v-form>
        <v-snackbar v-model="error.show" color="red" location="top">
            {{ error.text }}
        </v-snackbar>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { login } from '@/services/api.service'

    const router = useRouter()

    const form = ref(null)

    const password = ref('')
    const email = ref('')
    const error = ref({ show: false, text: '' })

    const emailRules = [v => !!v || 'Введите почту', v => /.+@.+\..+/.test(v) || 'Некорректный email']

    const passwordRules = [v => !!v || 'Введите пароль', v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов']

    const toRegister = () => {
        router.push('/register')
    }

    async function onSubmit() {
        const isValid = await form.value.validate()
        if (!isValid) return

        try {
            const response = await login(email.value, password.value)
            if (response.status === 200) {
                sessionStorage.setItem('profileSuccess', 'Успешный вход!')
                router.push('/profile')
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                error.value = { show: true, text: 'Неверный пароль' }
            } else if (err.response && err.response.status === 404) {
                error.value = { show: true, text: 'Пользователь не найден' }
            } else {
                error.value = { show: true, text: `Ошибка входа: ${err}` }
            }
            console.error('Ошибка входа', err)
        }
    }
</script>

<style lang="scss" scoped>
    .register-block {
        display: flex;
        justify-content: center;
        padding: 8rem;
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
    .register {
        justify-content: center;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem;
        border-top: solid 1px #a4a4a4;
        margin-top: 1rem;
    }
</style>
