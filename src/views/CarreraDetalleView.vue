<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AREA_LABEL, factoresPonderados, getCarrera } from '@/utils/carreras'
import { useFavoritesStore } from '@/stores/favorites'
import { useCompareStore } from '@/stores/compare'

const route = useRoute()
const router = useRouter()
const favorites = useFavoritesStore()
const compare = useCompareStore()

const carrera = computed(() => getCarrera(route.params.id as string))

const meta = computed(() => {
  const c = carrera.value
  if (!c) return []
  return [
    { l: 'Título profesional', v: c.titulo },
    { l: 'Grado académico', v: c.grado },
    { l: 'Duración', v: c.duracion },
    { l: 'Código', v: c.codigo },
    { l: 'Régimen de estudios', v: c.regimen },
  ]
})

const pondRows = computed(() => (carrera.value ? factoresPonderados(carrera.value) : []))

const esFavorita = computed(() => (carrera.value ? favorites.has(carrera.value.id) : false))

function volver() {
  router.push('/carreras')
}

function toggleFav() {
  if (carrera.value) favorites.toggle(carrera.value.id)
}

function irComparar() {
  if (!carrera.value) return
  compare.toggle(carrera.value.id)
  router.push('/comparar')
}

function irSimulador() {
  if (!carrera.value) return
  router.push({ path: '/simulador', query: { carrera: carrera.value.id } })
}
</script>

<template>
  <section v-if="carrera" class="animate-vp-fade">
    <button
      class="mb-4.5 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-slate-500"
      @click="volver"
    >
      ← Volver a carreras
    </button>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.45fr_1fr]">
      <div>
        <div
          class="rounded-[22px] bg-gradient-to-br from-blue-600 to-sky-500 px-8 py-7.5 text-white shadow-xl shadow-blue-600/30"
        >
          <span class="rounded-full bg-white/20 px-2.75 py-1 text-[11px] font-bold">
            {{ carrera.uni }} · {{ AREA_LABEL[carrera.area] }}
          </span>
          <h1 class="mt-3.5 mb-1 font-display text-[34px] leading-tight font-extrabold tracking-tight">
            {{ carrera.nombre }}
          </h1>
          <div class="text-[15px] opacity-90">{{ carrera.perfil }}</div>
        </div>

        <h3 class="mt-7 mb-3.5 font-display text-lg font-bold">Información de la carrera</h3>
        <div class="overflow-hidden rounded-[18px] border border-line bg-white">
          <div
            v-for="m in meta"
            :key="m.l"
            class="flex justify-between gap-4 border-b border-slate-100 px-5.5 py-3.75 text-right last:border-b-0"
          >
            <span class="text-left text-sm text-slate-500">{{ m.l }}</span>
            <span class="font-display text-[14.5px] font-semibold">{{ m.v }}</span>
          </div>
        </div>

        <h3 class="mt-7 mb-3.5 font-display text-lg font-bold">Ponderaciones de admisión</h3>
        <div class="rounded-[18px] border border-line bg-white p-5.5">
          <div v-for="r in pondRows" :key="r.key" class="mb-4 last:mb-0">
            <div class="mb-1.5 flex justify-between text-sm">
              <span class="font-semibold">{{ r.label }}</span>
              <span class="font-display font-bold text-blue-600">{{ r.value }}%</span>
            </div>
            <div class="h-2.25 overflow-hidden rounded-full bg-[#eef2f7]">
              <div
                class="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500"
                :style="{ width: r.value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-22.5">
        <div class="rounded-[20px] border border-line bg-white p-6 shadow-lg shadow-slate-900/5">
          <h3 class="mb-4 font-display text-base font-bold">Admisión 2025</h3>
          <div class="grid gap-3">
            <div class="rounded-[14px] bg-[#eff6ff] p-4">
              <div class="text-xs text-blue-500">Puntaje primer seleccionado</div>
              <div class="font-display text-[28px] font-extrabold text-blue-700">{{ carrera.primero.toFixed(1) }}</div>
            </div>
            <div class="rounded-[14px] bg-surface p-4">
              <div class="text-xs text-slate-500">Puntaje último seleccionado (corte)</div>
              <div class="font-display text-[28px] font-extrabold">{{ carrera.ultimo.toFixed(1) }}</div>
            </div>
            <div class="rounded-[14px] bg-surface p-4">
              <div class="text-xs text-slate-500">Vacantes</div>
              <div class="font-display text-[28px] font-extrabold">{{ carrera.vacantes }}</div>
            </div>
          </div>
          <div class="mt-4.5 grid gap-2.5">
            <button
              class="cursor-pointer rounded-[13px] border-[1.5px] px-4 py-3.25 font-display text-[15px] font-semibold"
              :class="
                esFavorita
                  ? 'border-rose-200 bg-[#fff1f3] text-rose-600'
                  : 'border-[#cdd9ea] bg-white text-slate-700'
              "
              @click="toggleFav"
            >
              {{ esFavorita ? '♥  En favoritas' : '♡  Agregar a favoritas' }}
            </button>
            <button
              class="cursor-pointer rounded-[13px] border-[1.5px] border-[#cdd9ea] bg-white px-4 py-3.25 font-display text-[15px] font-semibold text-slate-700"
              @click="irComparar"
            >
              ⚖️ Comparar carrera
            </button>
            <button
              class="cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-4 py-3.25 font-display text-[15px] font-semibold text-white"
              @click="irSimulador"
            >
              🚀 Simular postulación
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="animate-vp-fade">
    <div class="rounded-[18px] border border-line bg-white px-6 py-16 text-center">
      <p class="mb-4 text-sm text-slate-500">No encontramos esa carrera.</p>
      <button
        class="cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-6 py-3 font-display text-[15px] font-semibold text-white"
        @click="volver"
      >
        Volver a carreras
      </button>
    </div>
  </section>
</template>
