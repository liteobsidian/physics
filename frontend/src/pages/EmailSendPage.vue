<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center">
            <v-col cols="12" class="text-center editor-container contrainer">
                <div class="header">
                    <v-icon color="primary" size="48">mdi-flask</v-icon>
                    <h2 class="editor-font">Письмо отправлено!</h2>
                </div>
                <p class="mt-4">
                    Проверьте вашу почту, на неё должно было прийти письмо с подтверждением регистрации. Письмо
                    действительно 7 часов
                </p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import '@/assets/main.css'
</script>

<style lang="scss" scoped>
    .contrainer {
        margin-top: 20vh;
        max-width: 500px;
        padding: 2rem;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    p {
        font-size: 20px;
        text-align: center;
        text-wrap: balance;
    }
    .header {
        border-bottom: 1px solid #d7d7d7;
    }
</style>
