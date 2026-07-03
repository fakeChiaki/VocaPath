<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'

const favorites = useFavoritesStore()

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
      <nav class="ml-auto flex flex-wrap items-center justify-end gap-1">
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
      </nav>
    </div>
  </header>
</template>
