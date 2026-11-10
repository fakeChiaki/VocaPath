<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Career } from '@/types/api'
import { areaName, formatScore } from '@/utils/careers'
import { useCatalogStore } from '@/stores/catalog'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps<{ career: Career }>()

const router = useRouter()
const favorites = useFavoritesStore()
const catalog = useCatalogStore()

function openCareer() {
  router.push(`/carreras/${props.career.id}`)
}

function toggleFav(e: Event) {
  e.stopPropagation()
  favorites.toggle(props.career.id)
}
</script>

<template>
  <div
    class="cursor-pointer rounded-[18px] border border-line bg-white p-5.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
    @click="openCareer"
  >
    <div class="flex items-start justify-between gap-2.5">
      <span
        class="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
        :style="{ background: catalog.universityColor(career.universityName) }"
      >
        {{ career.universityName }}
      </span>
      <button
        class="size-8.5 cursor-pointer rounded-[10px] border-none text-base"
        :class="favorites.has(career.id) ? 'bg-[#fff1f3] text-rose-600' : 'bg-slate-100 text-slate-400'"
        :aria-label="favorites.has(career.id) ? 'Quitar de favoritas' : 'Agregar a favoritas'"
        @click="toggleFav"
      >
        {{ favorites.has(career.id) ? '♥' : '♡' }}
      </button>
    </div>
    <div class="mt-3.5 mb-1 font-display text-lg leading-tight font-bold">{{ career.name }}</div>
    <div class="mb-4.5 text-[13px] text-slate-500">{{ areaName(career) }}</div>
    <div class="flex gap-2.5">
      <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
        <div class="text-[11px] text-slate-500">Corte</div>
        <div class="font-display text-base font-bold text-blue-600">{{ formatScore(career.cutoffScore, '—') }}</div>
      </div>
      <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
        <div class="text-[11px] text-slate-500">Vacantes</div>
        <div class="font-display text-base font-bold">{{ career.vacantes }}</div>
      </div>
    </div>
  </div>
</template>
