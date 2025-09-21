// import './assets/main.css' // Закомментировано, если нет этого файла
import './assets/main.css' // Подключаем глобальные стили

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import pinia from './plugins/pinia'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.component('QuillEditor', QuillEditor)

app.mount('#app')
