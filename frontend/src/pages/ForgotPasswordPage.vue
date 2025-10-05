<template>
    <v-sheet class="register-block">
        <h1>Забыли пароль?</h1>
        <div class="desc-container editor-description mb-4">
            <h3>Введите вашу почту, чтобы мы могли отправить вам письмо с дальнейшими указаниями</h3>
        </div>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field label="Почта" v-model="email" :rules="emailRules" type="email"></v-text-field>
            <v-btn type="submit" class="button">Восстановить пароль</v-btn>
            <v-btn class="button" @click="goBack">Назад</v-btn>
            <div class="d-felx register" v-if="mailSendet">
                <span>Письмо с восстановлением пароля было отправлено вам на почту</span>
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
    import { forgotPassword } from '@/services/api.service'
    import '@/assets/main.css'

    const router = useRouter()

    const goBack = () => {
        router.back()
    }

    const form = ref(null)

    const mailSendet = ref(false)

    const email = ref('')
    const error = ref({ show: false, text: '' })

    const emailRules = [v => !!v || 'Введите почту', v => /.+@.+\..+/.test(v) || 'Некорректный email']

    async function onSubmit() {
        try {
            console.log(email.value)
            const response = await forgotPassword(email.value)
            if (response.status === 200) {
                mailSendet.value = true
            }
        } catch (err) {
            error.value = { show: true, text: `Ошибка: ${err}` }
            console.error('Ошибка', err)
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
    .desc-container {
        max-width: 400px;
    }
</style>
