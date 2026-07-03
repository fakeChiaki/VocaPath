<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Carrera } from '@/types'
import { AREA_LABEL, uniColor } from '@/utils/carreras'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps<{ carrera: Carrera }>()

const router = useRouter()
const favorites = useFavoritesStore()

function abrir() {
  router.push(`/carreras/${props.carrera.id}`)
}

function toggleFav(e: Event) {
  e.stopPropagation()
  favorites.toggle(props.carrera.id)
}
</script>

<template>
  <div
    class="cursor-pointer rounded-[18px] border border-line bg-white p-5.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
    @click="abrir"
  >
    <div class="flex items-start justify-between gap-2.5">
      <span
        class="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
        :style="{ background: uniColor(carrera.uni) }"
      >
        {{ carrera.uni }}
      </span>
      <button
        class="size-8.5 cursor-pointer rounded-[10px] border-none text-base"
        :class="favorites.has(carrera.id) ? 'bg-[#fff1f3] text-rose-600' : 'bg-slate-100 text-slate-400'"
        :aria-label="favorites.has(carrera.id) ? 'Quitar de favoritas' : 'Agregar a favoritas'"
        @click="toggleFav"
      >
        {{ favorites.has(carrera.id) ? '♥' : '♡' }}
      </button>
    </div>
    <div class="mt-3.5 mb-1 font-display text-lg leading-tight font-bold">{{ carrera.nombre }}</div>
    <div class="mb-4.5 text-[13px] text-slate-500">{{ AREA_LABEL[carrera.area] }}</div>
    <div class="flex gap-2.5">
      <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
        <div class="text-[11px] text-slate-500">Corte 2025</div>
        <div class="font-display text-base font-bold text-blue-600">{{ carrera.ultimo.toFixed(1) }}</div>
      </div>
      <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
        <div class="text-[11px] text-slate-500">Vacantes</div>
        <div class="font-display text-base font-bold">{{ carrera.vacantes }}</div>
      </div>
    </div>
  </div>
</template>
