// import './assets/main.css' // Закомментировано, если нет этого файла
import './assets/main.css' // Подключаем глобальные стили

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)

// app.use(createPinia()) // Закомментировано, если Pinia не используется
app.use(router)
app.use(vuetify)

app.mount('#app')
