<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { errorMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const justRegistered = route.query.registered != null

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(destination.startsWith('/') && !destination.startsWith('//') ? destination : '/')
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-[420px] animate-vp-fade">
    <div class="mb-6 text-center">
      <h1 class="font-display text-[30px] font-bold tracking-tight">Inicia sesión</h1>
      <p class="mt-1.5 text-sm text-slate-500">Accede a tus puntajes, favoritas y resultados.</p>
    </div>

    <form class="rounded-[22px] border border-line bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,0.06)]" @submit.prevent="submit">
      <p v-if="justRegistered" class="mb-4 rounded-[12px] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Cuenta creada. Ya puedes iniciar sesión.
      </p>

      <label for="login-email" class="text-[13px] font-semibold text-slate-500">Correo</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <label for="login-password" class="text-[13px] font-semibold text-slate-500">Contraseña</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <p v-if="error" class="mb-4 rounded-[12px] bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-4 py-3.25 font-display text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {{ loading ? 'Ingresando…' : 'Iniciar sesión' }}
      </button>

      <p class="mt-5 text-center text-sm text-slate-500">
        ¿No tienes cuenta?
        <RouterLink to="/registro" class="font-semibold text-blue-600">Crear cuenta</RouterLink>
      </p>
    </form>
  </section>
</template>
