<template>
    <v-sheet class="register-block">
        <h1>Восстановления пароля</h1>
        <div class="desc-container editor-description">
            <h3>Проверьте вашу почту. На неё должно было прийти письмо с кодом восстановления пароля</h3>
        </div>
        <v-form ref="form" class="form" @submit.prevent="validateCode">
            <v-otp-input :length="5" variant="solo" class="mb-16" divider="•" v-model="code"></v-otp-input>
            <v-btn type="submit" class="button" :disabled="code.length < 5 || isLoading" :loading="isLoading">
                Подтвердить
            </v-btn>
        </v-form>
        <v-snackbar v-model="error.show" color="red" location="top">
            {{ error.text }}
        </v-snackbar>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { validateRecoveryPasswordCode } from '@/services/api.service'
    import '@/assets/main.css'

    const router = useRouter()

    const form = ref(null)

    const error = ref({ show: false, text: '' })

    const code = ref('')
    const isLoading = ref(false)

    async function validateCode() {
        try {
            console.log(code.value)
            isLoading.value = true
            const response = await validateRecoveryPasswordCode(String(code.value))
            if (response.status === 200) {
                router.push({ name: 'recovery-password' })
            }
        } catch (err) {
            isLoading.value = false
            if (err.status === 404) {
                error.value = { show: true, text: `Неверный код` }
            } else {
                error.value = { show: true, text: `Ошибк: ${err}` }
            }
            console.error('Ошибка', err)
        } finally {
            isLoading.value = false
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
