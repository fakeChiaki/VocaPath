import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { setSessionExpiredHandler } from '@/api/session'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App).use(createPinia()).use(router)

setSessionExpiredHandler(() => {
  useAuthStore().clear()
  const current = router.currentRoute.value
  if (!current.meta.guestOnly && !current.meta.public) {
    router.push({ name: 'login', query: { redirect: current.fullPath } })
  }
})

app.mount('#app')
