import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api, refreshAccessToken } from '@/api/client'
import { setAccessToken } from '@/api/session'
import { useFavoritesStore } from '@/stores/favorites'
import { useScoresStore } from '@/stores/scores'

interface AuthUser {
  id: string
  email: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function userFromToken(token: string): AuthUser {
  const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')))
  return { id: payload.sub, email: payload.email }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const ready = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  async function init() {
    if (ready.value) return
    try {
      user.value = userFromToken(await refreshAccessToken())
    } catch {
      user.value = null
    }
    ready.value = true
  }

  async function register(data: RegisterData) {
    await api.post('/auth/register', data)
  }

  async function login(email: string, password: string) {
    const { data } = await api.post<{ accessToken: string; user: AuthUser }>('/auth/login', { email, password })
    setAccessToken(data.accessToken)
    user.value = data.user
  }

  function clear() {
    setAccessToken(null)
    user.value = null
    useFavoritesStore().reset()
    useScoresStore().reset()
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      clear()
    }
  }

  return { user, ready, isAuthenticated, init, register, login, logout, clear }
})
