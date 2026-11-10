<script setup lang="ts">
import type { ScoreFactor } from '@/types'
import { FACTOR_LABELS } from '@/utils/careers'
import { isPaesSubject } from '@/utils/paes'
import { useScoresStore } from '@/stores/scores'

const scores = useScoresStore()

const factors: { key: ScoreFactor; icon: string }[] = [
  { key: 'lectora', icon: '📖' },
  { key: 'matematica', icon: '📐' },
  { key: 'matematica2', icon: '➗' },
  { key: 'historia', icon: '🏛️' },
  { key: 'ciencias', icon: '🔬' },
  { key: 'nem', icon: '🏅' },
  { key: 'ranking', icon: '📈' },
]

function onChange(factor: ScoreFactor, e: Event) {
  const input = e.target as HTMLInputElement
  if (input.value === '') {
    if (scores.values[factor] != null) scores.remove(factor)
    return
  }
  scores.set(factor, Number(input.value))
}
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-5">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Mis puntajes por materia</h1>
      <p class="text-base text-slate-500">
        Revisa, ingresa o elimina tus puntajes. {{ scores.registeredCount }} de 7 registrados.
      </p>
    </div>

    <div class="grid max-w-[840px] grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="f in factors" :key="f.key" class="rounded-[18px] border border-line bg-white px-5.5 py-5">
        <div class="mb-4 flex items-center gap-3">
          <span class="flex size-10.5 items-center justify-center rounded-xl bg-surface text-[21px]">{{ f.icon }}</span>
          <span class="font-display text-base font-bold">{{ FACTOR_LABELS[f.key] }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <div class="flex flex-1 items-center rounded-xl border-[1.5px] border-line bg-surface px-3.5">
            <input
              type="number"
              min="100"
              max="1000"
              :value="scores.values[f.key] ?? ''"
              placeholder="Ingresar puntaje (100–1000)"
              class="w-full flex-1 border-none bg-transparent py-3.25 font-display text-lg font-bold text-blue-700 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-slate-400"
              @change="onChange(f.key, $event)"
            />
          </div>
          <button
            v-if="scores.values[f.key] != null"
            class="h-12 w-11.5 cursor-pointer rounded-xl border-[1.5px] border-rose-200 bg-[#fff1f3] text-base text-rose-600"
            :aria-label="`Borrar puntaje de ${FACTOR_LABELS[f.key]}`"
            @click="scores.remove(f.key)"
          >
            🗑
          </button>
        </div>
        <RouterLink
          v-if="isPaesSubject(f.key) && scores.hasAttempt(f.key)"
          :to="`/prueba-paes/${f.key}?review=1`"
          class="mt-3 inline-block text-[13px] font-semibold text-blue-600 hover:underline"
        >
          Revisar respuestas correctas e incorrectas →
        </RouterLink>
      </div>
    </div>
  </section>
</template>
