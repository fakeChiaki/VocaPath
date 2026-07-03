<script setup lang="ts">
import type { FactorPuntaje, MateriaPaes } from '@/types'
import { FACTOR_LABEL, MATERIAS_PAES } from '@/utils/carreras'
import { useScoresStore } from '@/stores/scores'
import CacheWarning from '@/components/layout/CacheWarning.vue'

const scores = useScoresStore()

const materias: { key: FactorPuntaje; icon: string }[] = [
  { key: 'lectora', icon: '📖' },
  { key: 'matematica', icon: '📐' },
  { key: 'historia', icon: '🏛️' },
  { key: 'ciencias', icon: '🔬' },
  { key: 'nem', icon: '🏅' },
  { key: 'ranking', icon: '📈' },
]

function esMateriaPaes(key: FactorPuntaje): key is MateriaPaes {
  return (MATERIAS_PAES as string[]).includes(key)
}

function onChange(key: FactorPuntaje, e: Event) {
  const valor = (e.target as HTMLInputElement).value
  scores.setPuntaje(key, valor === '' ? null : Number(valor))
}
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-5">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Mis puntajes por materia</h1>
      <p class="text-base text-slate-500">
        Revisa, ingresa o elimina tus puntajes. {{ scores.registrados }} de 6 registrados.
      </p>
    </div>

    <CacheWarning
      class="mb-5.5 max-w-[760px]"
      mensaje="Estos puntajes se guardan en el caché del navegador. En modo incógnito o al limpiar el caché se eliminarán."
    />

    <div class="grid max-w-[840px] grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-for="m in materias" :key="m.key" class="rounded-[18px] border border-line bg-white px-5.5 py-5">
        <div class="mb-4 flex items-center gap-3">
          <span class="flex size-10.5 items-center justify-center rounded-xl bg-surface text-[21px]">{{ m.icon }}</span>
          <span class="font-display text-base font-bold">{{ FACTOR_LABEL[m.key] }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <div class="flex flex-1 items-center rounded-xl border-[1.5px] border-line bg-surface px-3.5">
            <input
              type="number"
              min="100"
              max="1000"
              :value="scores.puntajes[m.key] ?? ''"
              placeholder="Ingresar puntaje (100–1000)"
              class="w-full flex-1 border-none bg-transparent py-3.25 font-display text-lg font-bold text-blue-700 outline-none placeholder:text-sm placeholder:font-normal placeholder:text-slate-400"
              @change="onChange(m.key, $event)"
            />
          </div>
          <button
            v-if="scores.puntajes[m.key] != null"
            class="h-12 w-11.5 cursor-pointer rounded-xl border-[1.5px] border-rose-200 bg-[#fff1f3] text-base text-rose-600"
            :aria-label="`Borrar puntaje de ${FACTOR_LABEL[m.key]}`"
            @click="scores.borrarPuntaje(m.key)"
          >
            🗑
          </button>
        </div>
        <RouterLink
          v-if="esMateriaPaes(m.key) && scores.estaRendida(m.key)"
          :to="`/prueba-paes/${m.key}?revisar=1`"
          class="mt-3 inline-block text-[13px] font-semibold text-blue-600 hover:underline"
        >
          Revisar respuestas correctas e incorrectas →
        </RouterLink>
      </div>
    </div>
  </section>
</template>
