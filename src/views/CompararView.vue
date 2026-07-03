<script setup lang="ts">
import { computed } from 'vue'
import type { Carrera } from '@/types'
import { FACTOR_KEYS, FACTOR_LABEL, getCarrera, uniColor } from '@/utils/carreras'
import { useCareerFilter } from '@/composables/useCareerFilter'
import { useCompareStore } from '@/stores/compare'
import CareerSearchBar from '@/components/careers/CareerSearchBar.vue'

const compare = useCompareStore()
const { search, filtradas } = useCareerFilter()

const seleccionadas = computed<Carrera[]>(() => compare.ids.map((id) => getCarrera(id)).filter((c): c is Carrera => !!c))

interface FilaComparacion {
  label: string
  a: string
  b: string
  aColor: string
  bColor: string
}

const NEUTRO = '#0f172a'
const MEJOR = '#059669'

// Resalta en verde el valor "mejor" solo cuando más alto = objetivamente mejor (p. ej. vacantes).
// Para corte, puntajes y ponderaciones un número mayor no significa "mejor carrera", así que quedan neutros.
function colorMayorEsMejor(a: number, b: number): [string, string] {
  if (a === b) return [NEUTRO, NEUTRO]
  return a > b ? [MEJOR, NEUTRO] : [NEUTRO, MEJOR]
}

const filas = computed<FilaComparacion[]>(() => {
  const [ca, cb] = seleccionadas.value
  if (!ca || !cb) return []

  const out: FilaComparacion[] = []

  out.push({ label: 'Puntaje de corte 2025', a: ca.ultimo.toFixed(1), b: cb.ultimo.toFixed(1), aColor: NEUTRO, bColor: NEUTRO })

  out.push({ label: 'Primer seleccionado', a: ca.primero.toFixed(1), b: cb.primero.toFixed(1), aColor: NEUTRO, bColor: NEUTRO })

  const [vacantesAColor, vacantesBColor] = colorMayorEsMejor(ca.vacantes, cb.vacantes)
  out.push({ label: 'Vacantes', a: String(ca.vacantes), b: String(cb.vacantes), aColor: vacantesAColor, bColor: vacantesBColor })

  out.push({ label: 'Duración', a: ca.duracion, b: cb.duracion, aColor: NEUTRO, bColor: NEUTRO })

  for (const k of FACTOR_KEYS) {
    if (ca.pond[k] === 0 && cb.pond[k] === 0) continue
    out.push({ label: `Ponderación ${FACTOR_LABEL[k]}`, a: `${ca.pond[k]}%`, b: `${cb.pond[k]}%`, aColor: NEUTRO, bColor: NEUTRO })
  }

  return out
})
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-5.5">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Comparación de carreras</h1>
      <p class="text-base text-slate-500">Selecciona dos carreras del listado para verlas lado a lado.</p>
    </div>

    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
      <div class="rounded-[18px] border border-line bg-white p-4">
        <CareerSearchBar v-model="search" placeholder="Buscar carrera…" class="mb-3.5" />
        <div class="mb-2.5 flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400">{{ compare.count }} / 2 seleccionadas</span>
          <button
            v-if="compare.count > 0"
            class="cursor-pointer border-none bg-transparent text-xs font-semibold text-rose-600"
            @click="compare.clear"
          >
            Limpiar
          </button>
        </div>
        <div class="flex max-h-[520px] flex-col gap-2 overflow-y-auto">
          <button
            v-for="c in filtradas"
            :key="c.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-3 text-left"
            :class="
              compare.has(c.id)
                ? 'border-blue-600 bg-[#e7f0ff]'
                : 'border-line bg-white hover:border-blue-200'
            "
            @click="compare.toggle(c.id)"
          >
            <span
              class="flex size-6.5 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
              :class="compare.has(c.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'"
            >
              {{ compare.has(c.id) ? compare.ids.indexOf(c.id) + 1 : '' }}
            </span>
            <span class="min-w-0">
              <span class="block font-display text-sm font-semibold">{{ c.nombre }}</span>
              <span class="block text-xs text-slate-500">{{ c.uni }}</span>
            </span>
          </button>
        </div>
      </div>

      <div>
        <template v-if="compare.hasTwo">
          <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div v-for="c in seleccionadas" :key="c.id" class="relative rounded-[18px] border border-line bg-white p-5.5">
              <button
                class="absolute top-3.5 right-3.5 flex size-7 cursor-pointer items-center justify-center rounded-lg border-none bg-slate-100 text-sm text-slate-500"
                aria-label="Quitar de la comparación"
                @click="compare.toggle(c.id)"
              >
                ✕
              </button>
              <span class="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" :style="{ background: uniColor(c.uni) }">
                {{ c.uni }}
              </span>
              <div class="mt-3 mb-1.5 font-display text-[19px] font-bold">{{ c.nombre }}</div>
              <div class="text-[13px] leading-relaxed text-slate-500">{{ c.perfil }}</div>
            </div>
          </div>

          <div class="overflow-hidden rounded-[18px] border border-line bg-white">
            <div
              v-for="(r, i) in filas"
              :key="r.label"
              class="grid grid-cols-[1fr_1.3fr_1fr] items-center px-5.5 py-3.5"
              :class="i < filas.length - 1 ? 'border-b border-slate-100' : ''"
            >
              <div class="font-display text-base font-bold" :style="{ color: r.aColor }">{{ r.a }}</div>
              <div class="text-center text-[13px] font-semibold text-slate-500">{{ r.label }}</div>
              <div class="text-right font-display text-base font-bold" :style="{ color: r.bColor }">{{ r.b }}</div>
            </div>
          </div>
        </template>

        <div v-else class="rounded-[18px] border-2 border-dashed border-[#d6e0ee] bg-white px-6 py-16 text-center">
          <div class="mb-3 text-[42px]">⚖️</div>
          <div class="mb-1.5 font-display text-lg font-bold">Selecciona 2 carreras para comparar</div>
          <div class="text-sm text-slate-500">Elige desde el listado de la izquierda. La comparación aparecerá aquí.</div>
        </div>
      </div>
    </div>
  </section>
</template>
