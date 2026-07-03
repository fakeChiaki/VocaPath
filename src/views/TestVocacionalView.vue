<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Carrera, PreguntaVocacional } from '@/types'
import preguntasData from '@/data/test-vocacional.json'
import { AREA_LABEL, CARRERAS, uniColor } from '@/utils/carreras'

const preguntas = preguntasData as PreguntaVocacional[]

const indice = ref(0)
const respuestas = ref<Record<number, number>>({})
const finalizado = ref(false)

const total = computed(() => preguntas.length)
const actual = computed(() => preguntas[indice.value]!)
const progreso = computed(() => `${((indice.value + 1) / total.value) * 100}%`)
const seleccion = computed(() => respuestas.value[indice.value])
const esUltima = computed(() => indice.value === total.value - 1)
const puedeAvanzar = computed(() => seleccion.value != null)

function elegir(opcionIndex: number) {
  respuestas.value = { ...respuestas.value, [indice.value]: opcionIndex }
}

function atras() {
  if (indice.value > 0) indice.value -= 1
}

function siguiente() {
  if (!puedeAvanzar.value) return
  if (esUltima.value) {
    finalizado.value = true
    window.scrollTo({ top: 0 })
  } else {
    indice.value += 1
  }
}

function claseOpcion(opcionIndex: number): string {
  return seleccion.value === opcionIndex ? 'border-blue-600 bg-[#e7f0ff]' : 'border-line bg-white hover:border-blue-300'
}

function claseDot(opcionIndex: number): string {
  return seleccion.value === opcionIndex ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
}

function reiniciar() {
  indice.value = 0
  respuestas.value = {}
  finalizado.value = false
  window.scrollTo({ top: 0 })
}

interface Recomendacion {
  carrera: Carrera
  reason: string
}

const topAreas = computed<string[]>(() => {
  const tally: Record<string, number> = {}
  preguntas.forEach((p, i) => {
    const opIndex = respuestas.value[i]
    if (opIndex == null) return
    const area = p.opts[opIndex]!.area
    tally[area] = (tally[area] ?? 0) + 1
  })
  return Object.keys(tally).sort((a, b) => tally[b]! - tally[a]!).slice(0, 2)
})

const topAreaLabel = computed(() => topAreas.value.map((a) => AREA_LABEL[a] ?? a).join(' y '))

const recomendaciones = computed<Recomendacion[]>(() => {
  return CARRERAS.filter((c) => topAreas.value.includes(c.area))
    .slice(0, 4)
    .map((carrera) => ({
      carrera,
      reason: `Encaja con tu interés en ${(AREA_LABEL[carrera.area] ?? carrera.area).toLowerCase()}: ${carrera.perfil.split('.')[0]}.`,
    }))
})
</script>

<template>
  <section class="mx-auto max-w-[760px] animate-vp-fade">
    <template v-if="!finalizado">
      <div class="mb-6.5 text-center">
        <span class="text-[13px] font-semibold text-blue-600">TEST VOCACIONAL</span>
        <h1 class="mt-1.5 font-display text-[30px] font-bold tracking-tight">Descubre tu carrera ideal</h1>
      </div>

      <div class="mb-6.5 flex items-center gap-3.5">
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-[width] duration-300"
            :style="{ width: progreso }"
          ></div>
        </div>
        <span class="text-[13px] font-semibold whitespace-nowrap text-slate-500">{{ indice + 1 }} / {{ total }}</span>
      </div>

      <div class="rounded-[22px] border border-line bg-white p-8.5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
        <h2 class="mb-6 font-display text-[23px] leading-tight font-bold">{{ actual.text }}</h2>
        <div class="flex flex-col gap-3">
          <button
            v-for="(opcion, oi) in actual.opts"
            :key="opcion.label"
            class="flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] px-4.5 py-4 text-left transition-all duration-100"
            :class="claseOpcion(oi)"
            @click="elegir(oi)"
          >
            <span class="flex size-5.5 shrink-0 items-center justify-center rounded-full border-2" :class="claseDot(oi)">
              <span v-if="seleccion === oi" class="size-2 rounded-full bg-white"></span>
            </span>
            <span class="text-base font-medium">{{ opcion.label }}</span>
          </button>
        </div>

        <div class="mt-6.5 flex justify-between">
          <button
            :disabled="indice === 0"
            class="rounded-xl border-[1.5px] border-slate-200 bg-white px-5.5 py-3 font-display text-[15px] font-semibold text-slate-500"
            :class="indice === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-slate-300'"
            @click="atras"
          >
            ← Atrás
          </button>
          <button
            :disabled="!puedeAvanzar"
            class="rounded-xl border-none px-7 py-3 font-display text-[15px] font-semibold text-white"
            :class="puedeAvanzar ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-slate-300'"
            @click="siguiente"
          >
            {{ esUltima ? 'Ver resultados' : 'Siguiente →' }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mb-6.5 text-center">
        <div class="text-[48px]">🎉</div>
        <h1 class="mt-2 mb-1.5 font-display text-[32px] font-extrabold tracking-tight">Tus carreras recomendadas</h1>
        <p class="text-base text-slate-500">
          Según tus respuestas, tu mayor afinidad es con <strong class="text-blue-600">{{ topAreaLabel }}</strong>.
        </p>
      </div>

      <div class="flex flex-col gap-3.5">
        <RouterLink
          v-for="r in recomendaciones"
          :key="r.carrera.id"
          :to="`/carreras/${r.carrera.id}`"
          class="flex items-start gap-4.5 rounded-[18px] border border-line bg-white p-5.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
        >
          <span
            class="flex size-11.5 shrink-0 items-center justify-center rounded-[13px] font-display text-[13px] font-extrabold text-white"
            :style="{ background: uniColor(r.carrera.uni) }"
          >
            {{ r.carrera.uni }}
          </span>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="font-display text-lg font-bold">{{ r.carrera.nombre }}</span>
              <span class="rounded-full bg-[#eff6ff] px-2.25 py-0.75 text-[11px] font-semibold text-blue-600">
                {{ AREA_LABEL[r.carrera.area] }}
              </span>
            </div>
            <div class="mt-1.5 text-sm leading-relaxed text-slate-500">{{ r.reason }}</div>
          </div>
          <span class="text-xl text-slate-400">→</span>
        </RouterLink>
      </div>

      <div class="mt-6 text-center">
        <button
          class="cursor-pointer rounded-[13px] border-[1.5px] border-[#cdd9ea] bg-white px-6.5 py-3 font-display text-[15px] font-semibold text-slate-700"
          @click="reiniciar"
        >
          ↺ Repetir test
        </button>
      </div>
    </template>
  </section>
</template>
