<template>
    <v-sheet class="change-password-block">
        <h1>Изменение пароля</h1>
        <v-form ref="form" class="form" @submit.prevent="onSubmit">
            <v-text-field label="Введите пароль" v-model="currentPassword" :rules="currentPasswordRules"></v-text-field>
            <v-text-field label="Введите новый пароль" :rules="newPasswordRules" v-model="newPassword"></v-text-field>
            <v-text-field
                label="Повторите новый пароль"
                :rules="confirmPasswordRules"
                v-model="repeatNewPassword"
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
    import { changePassword } from '@/services/api.service'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const currentPassword = ref('')
    const newPassword = ref('')
    const repeatNewPassword = ref('')
    const form = ref(null)
    const error = ref({ show: false, text: '' })

    const onSubmit = async () => {
        const { valid } = await form.value.validate()
        if (!valid) return
        try {
            const response = await changePassword(currentPassword.value, newPassword.value)
            if (response.status === 201) {
                sessionStorage.setItem('changePasswordSuccess', 'Пароль успешно изменён!')
                router.push('/profile')
            }
        } catch (err) {
            if (err && err.response.status === 404) {
                error.value = { show: true, text: 'Неверный текущий пароль' }
                return
            }
            if (err && err.response.status === 409) {
                error.value = { show: true, text: 'Новый пароль совпадает со старым' }
                return
            }
            error.value = { show: true, text: 'Неизвестная ошибка сервера' }
        }
    }

    const currentPasswordRules = [
        v => !!v || 'Введите пароль',
        v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов',
        v => v !== newPassword.value || 'Пароли не должны совпадать',
    ]

    const newPasswordRules = [
        v => !!v || 'Введите пароль',
        v => v.length >= 4 || 'Пароль должен быть длиннее 4 символов',
        v => v !== currentPassword.value || 'Пароли не должны совпадать',
    ]

    const confirmPasswordRules = [v => !!v || 'Повторите пароль', v => v === newPassword.value || 'Пароли не совпадают']
</script>

<style lang="scss" scoped>
    .change-password-block {
        display: flex;
        justify-content: center;
        padding: 5rem;
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
