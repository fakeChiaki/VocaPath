<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'

const router = useRouter()
const auth = useAuthStore()
const favorites = useFavoritesStore()

async function cerrarSesion() {
  await auth.logout()
  router.push('/login')
}

const items = [
  { label: 'Fechas PAES', to: '/fechas' },
  { label: 'Carreras', to: '/carreras' },
  { label: 'Universidades', to: '/universidades' },
  { label: 'Comparar', to: '/comparar' },
  { label: 'Test Vocacional', to: '/test-vocacional' },
  { label: 'Prueba PAES', to: '/prueba-paes' },
  { label: 'Mis Puntajes', to: '/puntajes' },
  { label: 'Simulador', to: '/simulador' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex min-h-17 max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-0 px-7 py-2">
      <RouterLink to="/" class="flex items-center gap-2.5">
        <span
          class="flex size-8.5 items-center justify-center rounded-[11px] bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-600/35"
        >
          <span class="size-3 rotate-45 rounded-full border-3 border-white border-t-transparent"></span>
        </span>
        <span class="font-display text-xl font-bold tracking-tight">Voca<span class="text-blue-600">Path</span></span>
      </RouterLink>
      <nav v-if="!auth.isAuthenticated" class="ml-auto flex items-center gap-1">
        <RouterLink
          to="/login"
          class="rounded-[10px] px-3 py-2 text-[13.5px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Iniciar sesión
        </RouterLink>
        <RouterLink
          to="/registro"
          class="rounded-[10px] bg-blue-600 px-3.5 py-2 text-[13.5px] font-semibold text-white"
        >
          Crear cuenta
        </RouterLink>
      </nav>
      <nav v-else class="ml-auto flex flex-wrap items-center justify-end gap-1">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="rounded-[10px] px-3 py-2 text-[13.5px] font-semibold whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-100"
          active-class="!bg-[#e7f0ff] !text-blue-600"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink
          to="/favoritas"
          class="ml-1 flex items-center gap-1.5 rounded-[10px] bg-[#fff1f3] px-3 py-2 text-[13.5px] font-semibold text-rose-600"
          active-class="ring-1 ring-rose-300"
        >
          <span class="text-sm">♥</span> {{ favorites.count }}
        </RouterLink>
        <button
          class="ml-1 cursor-pointer rounded-[10px] border-none bg-transparent px-3 py-2 text-[13.5px] font-semibold text-slate-500 hover:bg-slate-100"
          :title="auth.user?.email"
          @click="cerrarSesion"
        >
          Cerrar sesión
        </button>
      </nav>
    </div>
  </header>
</template>
