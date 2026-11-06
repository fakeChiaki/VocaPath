<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { errorMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const cargando = ref(false)

async function enviar() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  cargando.value = true
  try {
    await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
    })
    router.push({ name: 'login', query: { registrado: '1' } })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-[420px] animate-vp-fade">
    <div class="mb-6 text-center">
      <h1 class="font-display text-[30px] font-bold tracking-tight">Crea tu cuenta</h1>
      <p class="mt-1.5 text-sm text-slate-500">Guarda tus puntajes y carreras favoritas.</p>
    </div>

    <form class="rounded-[22px] border border-line bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,0.06)]" @submit.prevent="enviar">
      <label for="reg-name" class="text-[13px] font-semibold text-slate-500">Nombre</label>
      <input
        id="reg-name"
        v-model="name"
        type="text"
        required
        minlength="2"
        autocomplete="name"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <label for="reg-email" class="text-[13px] font-semibold text-slate-500">Correo</label>
      <input
        id="reg-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <label for="reg-password" class="text-[13px] font-semibold text-slate-500">Contraseña (mínimo 8 caracteres)</label>
      <input
        id="reg-password"
        v-model="password"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <label for="reg-confirm" class="text-[13px] font-semibold text-slate-500">Confirmar contraseña</label>
      <input
        id="reg-confirm"
        v-model="confirmPassword"
        type="password"
        required
        autocomplete="new-password"
        class="mt-1.5 mb-4 w-full rounded-[13px] border-[1.5px] border-[#cdd9ea] px-4 py-3 text-[15px] outline-none focus:border-blue-600"
      />

      <p v-if="error" class="mb-4 rounded-[12px] bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{{ error }}</p>

      <button
        type="submit"
        :disabled="cargando"
        class="w-full cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-4 py-3.25 font-display text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {{ cargando ? 'Creando cuenta…' : 'Crear cuenta' }}
      </button>

      <p class="mt-5 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="font-semibold text-blue-600">Inicia sesión</RouterLink>
      </p>
    </form>
  </section>
</template>
