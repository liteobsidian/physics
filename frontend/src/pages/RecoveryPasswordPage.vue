<template>
    <v-sheet class="change-password-block">
        <h1 class="mb-8">Восстановление пароля</h1>
        <v-form class="form" @submit.prevent="submitNewPassword">
            <v-text-field
                label="Введите новый пароль"
                :rules="newPasswordRules"
                v-model="newPassword"
                autocomplete="off"
            ></v-text-field>
            <v-text-field
                label="Повторите новый пароль"
                :rules="confirmPasswordRules"
                v-model="repeatNewPassword"
                autocomplete="off"
                type="password"
            ></v-text-field>
            <v-btn type="submit" class="button">Изменить пароль</v-btn>
        </v-form>
        <v-snackbar v-model="error.show" color="red" location="top">
            {{ error.text }}
        </v-snackbar>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { recoveryPassword } from '@/services/api.service'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const newPassword = ref('')
    const repeatNewPassword = ref('')
    const error = ref({ show: false, text: '' })

    const newPasswordRules = [
        v => !!v || 'Введите пароль',
        v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов',
    ]

    const confirmPasswordRules = [v => !!v || 'Повторите пароль', v => v === newPassword.value || 'Пароли не совпадают']

    async function submitNewPassword() {
        try {
            const response = await recoveryPassword(newPassword.value)
            if (response.status === 201) {
                sessionStorage.setItem('recoveryPasswordSuccess', 'Пароль успешно изменён!')
                router.push('/login')
            }
        } catch (err) {
            if (err && err.response.status === 409) {
                error.value = { show: true, text: 'Новый пароль совпадает со старым' }
            } else {
                error.value = { show: true, text: `Ошибка: ${err.name}` }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .change-password-block {
        display: flex;
        justify-content: center;
        padding: 8rem;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    .button {
        align-self: center;
        background-color: #4285f4 !important;
        color: #ffff;
        width: 80%;
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 70%;
    }
</style>
