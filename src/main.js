import './assets/style/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.use(router)

const authStore = useAuthStore()

authStore
  .checkAuthStatus()
  .then(() => {
    app.mount('#app')
  })
  .catch(() => {
    app.mount('#app')
  })
