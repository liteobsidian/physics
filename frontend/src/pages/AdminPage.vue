<template>
    <v-btn
        class="clickable mt-4"
        icon="mdi-arrow-left"
        variant="text"
        color="black"
        style="text-transform: none"
        @click="toProfile"
    ></v-btn>
    <div class="editor-container mt-4">
        <div class="list-container">
            <h3 class="editor-font mb-2">😎Админы:</h3>
            <ul class="admin-list">
                <li v-for="item in visibleAdmins" :key="item.id">
                    <div class="list-item">
                        <div>
                            <strong>ID:</strong> {{ item.id }} <strong>Пользователь: </strong> {{ item.username }}
                        </div>
                        <v-btn color="primary" @click="deleteAdmin(item.id, item.username)">удалить</v-btn>
                    </div>
                </li>
            </ul>
            <div class="pagination-btns mt-4">
                <v-btn @click="prevPage" :disabled="page === 0">Назад</v-btn>
                <v-btn @click="nextPage" :disabled="endIndex >= admins.length">Дальше</v-btn>
            </div>
        </div>

        <div>
            <div class="d-flex justify-sm-space-between mb-2">
                <h3 class="editor-font">Добавить админа</h3>
            </div>
            <v-autocomplete
                label="Выберите пользователя"
                :items="users.filter(u => u.role === 'user')"
                item-value="id"
                item-title="username"
                v-model="selectedUser"
                return-object
                autocomplete="off"
            />
            <v-btn @click="addAdmin">Добавить</v-btn>
        </div>
    </div>
    <v-snackbar v-model="successSnacbar.show" color="green" location="top" :timeout="2000">
        {{ successSnacbar.text }}
    </v-snackbar>
    <v-snackbar v-model="errorSnacbar.show" color="error" location="top" :timeout="4000">
        {{ errorSnacbar.text }}
    </v-snackbar>
</template>
<script setup>
    import '@/assets/main.css'
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { getUsers } from '@/services/admin.service'
    import { editUserRole } from '@/services/admin.service'
    import { userStorage } from '@/plugins/pinia'

    const router = useRouter()
    const userStore = userStorage()

    const currentAdmin = computed(() => userStore.user_id)

    const users = ref([])
    const page = ref(0)
    const PAGE_SIZE = 5``
    const successSnacbar = ref({ show: false, text: '' })
    const errorSnacbar = ref({ show: false, text: '' })

    const selectedUser = ref(null)

    function clearFileds() {
        selectedUser.value = null
    }

    const toProfile = () => {
        router.back()
    }

    async function getData() {
        const usersResponse = await getUsers()
        users.value = usersResponse.data
    }

    const admins = computed(() => {
        let admins = users.value
        return admins.filter(u => u.role === 'admin' && u.id !== currentAdmin.value)
    })

    const startIndex = computed(() => page.value * PAGE_SIZE)
    const endIndex = computed(() => startIndex.value + PAGE_SIZE)
    const visibleAdmins = computed(() => admins.value.slice(startIndex.value, endIndex.value))

    function nextPage() {
        if (endIndex.value < admins.value.length) page.value++
    }
    function prevPage() {
        if (page.value > 0) page.value--
    }

    async function addAdmin() {
        try {
            if (selectedUser.value !== null) {
                let res = await editUserRole(Number(selectedUser.value?.id), 'admin')
                if (res.status === 201) {
                    console.log(typeof Number(selectedUser.value.id))

                    successSnacbar.value = { show: true, text: `${selectedUser.value?.username} теперь админ!` }
                    clearFileds()
                    await getData()
                }
            }
        } catch (err) {
            console.error(err)
            if (err.response?.data.error === 'SequelizeDatabaseError') {
                errorSnacbar.value = { show: true, text: `Ошибка. Выберите пользователя!` }
            } else {
                errorSnacbar.value = { show: true, text: `Ошибка: ${err}` }
            }
        }
    }

    async function deleteAdmin(adminId, adminName) {
        try {
            if (adminId) {
                console.log(adminId, adminName)
                let res = await editUserRole(adminId, 'user')
                if (res.status === 201) {
                    successSnacbar.value = { show: true, text: `${adminName} больше не админ` }
                    clearFileds()
                    await getData()
                }
            }
        } catch (err) {
            console.error(err)
            errorSnacbar.value = { show: true, text: `Ошибка: ${err}` }
        }
    }

    onMounted(async () => {
        getData()
    })
</script>
<style lang="scss" scoped>
    .admin-list {
        list-style-type: none;
        max-height: 300px;
        overflow: hidden;
    }
    .list-item {
        background-color: #ececec;
        padding: 0.5rem;
        border-radius: 8px;
        font-size: 1rem;
        color: black;
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .pagination-btns {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
    }
</style>
