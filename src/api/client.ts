import axios, { type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, notifySessionExpired, setAccessToken } from './session'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

let refreshing: Promise<string> | null = null

const requestRefresh = () =>
  axios.post<{ accessToken: string }>('/auth/refresh', null, { baseURL: api.defaults.baseURL, withCredentials: true })

// Con dos pestañas abiertas, la otra puede rotar la cookie justo antes: se reintenta una vez con la cookie nueva.
async function refreshWithRetry() {
  try {
    return await requestRefresh()
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error
    await new Promise((resolve) => setTimeout(resolve, 400))
    return requestRefresh()
  }
}

// retry=false: al abrir la app sin sesión el 401 es lo esperado y no debe demorar la carga
export function refreshAccessToken(retry = true) {
  refreshing ??= (retry ? refreshWithRetry() : requestRefresh())
    .then(({ data }) => {
      setAccessToken(data.accessToken)
      return data.accessToken
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config as RetriableConfig | undefined
  const isAuthCall = config?.url?.startsWith('/auth/')
  if (error.response?.status !== 401 || !config || config._retried || isAuthCall) throw error

  config._retried = true
  try {
    await refreshAccessToken()
  } catch {
    setAccessToken(null)
    notifySessionExpired()
    throw error
  }
  return api(config)
})

export function errorMessage(error: unknown, fallback = 'Ocurrió un error. Intenta de nuevo.') {
  if (!axios.isAxiosError(error)) return fallback
  if (!error.response) return 'No se pudo conectar con el servidor.'
  const message = error.response.data?.message
  return Array.isArray(message) ? message.join('. ') : (message ?? fallback)
}
