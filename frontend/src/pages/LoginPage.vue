<template>
    <v-sheet class="register-block">
        <h1>Вход</h1>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field label="Почта" v-model="email" :rules="emailRules"></v-text-field>
            <v-text-field label="Пароль" :rules="passwordRules" v-model="password"></v-text-field>
            <v-btn type="submit" class="button">Войти</v-btn>
        </v-form>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { register } from '@/services/auth.service'

    const form = ref(null)

    const password = ref('')
    const confirmPassword = ref('')
    const username = ref('')
    const email = ref('')

    const emailRules = [v => !!v || 'Введите почту', v => /.+@.+\..+/.test(v) || 'Некорректный email']

    const passwordRules = [v => !!v || 'Введите пароль', v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов']

    async function onSubmit() {
        const isValid = await form.value.validate()
        if (!isValid) return

        try {
            const data = await register(username.value, email.value, password.value)
            console.log('Успешная регистрация', data)
        } catch (err) {
            console.error('Ошибка регистрации', err)
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
</style>
