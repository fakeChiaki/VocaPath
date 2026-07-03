<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CareerSearchBar from '@/components/careers/CareerSearchBar.vue'
import { useCareerFilter } from '@/composables/useCareerFilter'
import { useFavoritesStore } from '@/stores/favorites'
import { AREA_LABEL, CARRERAS, getUniversidad } from '@/utils/carreras'

const route = useRoute()
const router = useRouter()
const favorites = useFavoritesStore()

const universidad = computed(() => getUniversidad(route.params.nombre as string))

const carrerasUni = computed(() => CARRERAS.filter((c) => c.uni === universidad.value?.name))

const { search, filtradas } = useCareerFilter(carrerasUni)

function abrirCarrera(id: string) {
  router.push(`/carreras/${id}`)
}

function toggleFav(e: Event, id: string) {
  e.stopPropagation()
  favorites.toggle(id)
}
</script>

<template>
  <section v-if="universidad" class="animate-vp-fade">
    <button
      class="mb-4.5 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-slate-500"
      @click="router.push('/universidades')"
    >
      ← Volver a universidades
    </button>

    <div class="mb-6 flex items-center gap-4.5">
      <span
        class="flex size-16 items-center justify-center rounded-[18px] font-display text-xl font-extrabold text-white"
        :style="{ background: universidad.color }"
      >
        {{ universidad.name }}
      </span>
      <div>
        <h1 class="font-display text-3xl font-bold tracking-tight">{{ universidad.full }}</h1>
        <div class="text-sm text-slate-500">📍 {{ universidad.city }}</div>
      </div>
    </div>

    <CareerSearchBar v-model="search" placeholder="Buscar carrera en esta universidad…" class="mb-5" />

    <div class="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="c in filtradas"
        :key="c.id"
        class="cursor-pointer rounded-[18px] border border-line bg-white p-5.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
        @click="abrirCarrera(c.id)"
      >
        <div class="flex items-start justify-between gap-2.5">
          <span class="text-[13px] text-slate-500">{{ AREA_LABEL[c.area] }}</span>
          <button
            class="size-8.5 cursor-pointer rounded-[10px] border-none text-base"
            :class="favorites.has(c.id) ? 'bg-[#fff1f3] text-rose-600' : 'bg-slate-100 text-slate-400'"
            :aria-label="favorites.has(c.id) ? 'Quitar de favoritas' : 'Agregar a favoritas'"
            @click="toggleFav($event, c.id)"
          >
            {{ favorites.has(c.id) ? '♥' : '♡' }}
          </button>
        </div>
        <div class="mt-2 mb-4 font-display text-lg leading-tight font-bold">{{ c.nombre }}</div>
        <div class="flex gap-2.5">
          <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
            <div class="text-[11px] text-slate-500">Corte 2025</div>
            <div class="font-display text-base font-bold text-blue-600">{{ c.ultimo.toFixed(1) }}</div>
          </div>
          <div class="flex-1 rounded-[11px] bg-surface px-3 py-2.5">
            <div class="text-[11px] text-slate-500">Vacantes</div>
            <div class="font-display text-base font-bold">{{ c.vacantes }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="animate-vp-fade">
    <div class="rounded-[18px] border border-line bg-white px-6 py-16 text-center">
      <p class="mb-4 text-sm text-slate-500">No encontramos esa universidad.</p>
      <button
        class="cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-6 py-3 font-display text-[15px] font-semibold text-white"
        @click="router.push('/universidades')"
      >
        Volver a universidades
      </button>
    </div>
  </section>
</template>
