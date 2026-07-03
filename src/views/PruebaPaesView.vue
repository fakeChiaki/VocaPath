<script setup lang="ts">
import type { MateriaPaes } from '@/types'
import { MATERIAS_PAES, PRUEBAS_PAES } from '@/utils/carreras'
import { useScoresStore } from '@/stores/scores'

const scores = useScoresStore()

function textoBadge(materia: MateriaPaes): string {
  const pts = scores.puntajes[materia]
  const base = pts != null ? `${pts} pts` : 'Rendida'
  const mencion = scores.mencionesRendidas[materia]
  const menciones = PRUEBAS_PAES[materia].menciones
  return mencion && menciones ? `${base} · ${menciones[mencion].label}` : base
}
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-6">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Prueba tipo PAES</h1>
      <p class="text-base text-slate-500">
        Practica con preguntas de alternativas por materia. Al terminar verás tus respuestas correctas e incorrectas, y
        tu puntaje se guarda en el caché.
      </p>
    </div>
    <div class="grid max-w-[760px] grid-cols-1 gap-4.5 sm:grid-cols-2">
      <div v-for="materia in MATERIAS_PAES" :key="materia" class="rounded-[18px] border border-line bg-white p-6">
        <div class="flex items-center justify-between">
          <span class="flex size-13 items-center justify-center rounded-[14px] bg-surface text-[26px]">
            {{ PRUEBAS_PAES[materia].icon }}
          </span>
          <span
            v-if="scores.estaRendida(materia)"
            class="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700"
          >
            {{ textoBadge(materia) }}
          </span>
        </div>
        <div class="mt-4 mb-1 font-display text-[19px] font-bold">{{ PRUEBAS_PAES[materia].label }}</div>
        <div class="mb-4.5 text-[13px] text-slate-500">Prueba de alternativas</div>
        <RouterLink
          :to="`/prueba-paes/${materia}`"
          class="block w-full rounded-[13px] bg-gradient-to-br from-blue-600 to-sky-500 py-3 text-center font-display text-[15px] font-semibold text-white"
        >
          Rendir prueba →
        </RouterLink>
      </div>
    </div>
  </section>
</template>
