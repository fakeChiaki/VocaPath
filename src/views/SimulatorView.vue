<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, errorMessage } from '@/api/client'
import type { SimulationResult } from '@/types/api'
import { FACTOR_LABELS, factorLabel, factorValue, formatScore, requiredFactors } from '@/utils/careers'
import { useCatalogStore } from '@/stores/catalog'
import { useScoresStore } from '@/stores/scores'

const route = useRoute()
const scores = useScoresStore()
const catalog = useCatalogStore()

const careerId = ref(typeof route.query.career === 'string' ? route.query.career : '')
watch(
  () => route.query.career,
  (value) => {
    careerId.value = typeof value === 'string' ? value : ''
  },
)

const career = computed(() => catalog.getCareer(careerId.value))
const result = ref<SimulationResult | null>(null)
const loading = ref(false)
const error = ref('')
let lastRequest = 0

async function simulate() {
  result.value = null
  error.value = ''
  if (!career.value) return
  const request = ++lastRequest
  loading.value = true
  try {
    const { data } = await api.get<SimulationResult>(`/simulator/${career.value.id}`)
    if (request === lastRequest) result.value = data
  } catch (e) {
    if (request === lastRequest) error.value = errorMessage(e)
  } finally {
    if (request === lastRequest) loading.value = false
  }
}

watch(careerId, simulate, { immediate: true })

const scored = computed(() => result.value?.status === 'success' || result.value?.status === 'not_enough')
const admitted = computed(() => result.value?.status === 'success')
const total = computed(() => result.value?.weightedScore ?? 0)
const cutoff = computed(() => career.value?.cutoffScore ?? 0)
const difference = computed(() => total.value - cutoff.value)

const missingLabels = computed(() => [
  ...(result.value?.missingFactors ?? []).map((f) => FACTOR_LABELS[f]),
  ...(result.value?.missingAnyOf ? ['Historia o Ciencias (el mayor)'] : []),
])

const breakdown = computed(() => {
  const c = career.value
  if (!scored.value || !c) return []
  return requiredFactors(c).map((k) => {
    const value = factorValue(c, scores.values, k) ?? 0
    return {
      key: k,
      label: factorLabel(c, k),
      weight: `${c.weights[k]}%`,
      score: value,
      contribution: ((c.weights[k] * value) / 100).toFixed(1),
    }
  })
})

const barScore = computed(() => `${Math.min(100, (total.value / 1100) * 100)}%`)
const barCutoff = computed(() => `${Math.min(100, (cutoff.value / 1100) * 100)}%`)
</script>

<template>
  <section class="max-w-[840px] animate-vp-fade">
    <div class="mb-5.5">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Simulador de postulación</h1>
      <p class="text-base text-slate-500">
        Compara tus puntajes con el corte de la carrera que elijas. Necesitas tener todos los puntajes que pide la
        carrera.
      </p>
    </div>

    <div class="mb-4.5 rounded-[18px] border border-line bg-white p-5.5">
      <label for="sim-career" class="text-[13px] font-semibold text-slate-500">Elige la carrera a simular</label>
      <select
        id="sim-career"
        v-model="careerId"
        class="mt-2 w-full cursor-pointer rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3.5 font-display text-[15px] font-semibold text-ink"
      >
        <option value="">— Selecciona una carrera —</option>
        <option v-for="c in catalog.careers" :key="c.id" :value="c.id">{{ c.name }} · {{ c.universityName }}</option>
      </select>
    </div>

    <template v-if="career">
      <p v-if="loading" class="text-sm text-slate-500">Calculando…</p>
      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800" role="alert">
        {{ error }}
        <button class="ml-3 cursor-pointer border-none bg-transparent font-semibold text-rose-700 underline" @click="simulate">
          Reintentar
        </button>
      </div>

      <div
        v-else-if="result?.status === 'cutoff_unavailable'"
        class="rounded-[20px] border-[1.5px] border-slate-200 bg-slate-50 p-7.5 text-center"
      >
        <div class="mb-2.5 text-[38px]">🔒</div>
        <div class="mb-1.5 font-display text-[19px] font-bold">Esta carrera no publica su puntaje de corte</div>
        <div class="text-[14.5px] text-slate-600">
          Sin ese dato no podemos comparar tu puntaje ponderado con el de <strong>{{ career.name }}</strong>.
        </div>
      </div>

      <template v-else-if="scored">
        <div
          class="mb-4.5 rounded-[20px] border-[1.5px] p-7"
          :class="admitted ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'"
        >
          <div class="mb-5 flex items-center gap-3.5">
            <span class="text-[40px]">{{ admitted ? '🎉' : '📉' }}</span>
            <div>
              <div class="font-display text-2xl font-extrabold" :class="admitted ? 'text-emerald-700' : 'text-red-700'">
                {{ admitted ? '¡Alcanzas el puntaje de corte!' : 'Aún no alcanzas el corte' }}
              </div>
              <div class="text-sm text-slate-600">{{ career.name }} · {{ career.universityName }}</div>
            </div>
          </div>
          <div class="mb-4.5 flex flex-col gap-4 sm:flex-row">
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Tu puntaje ponderado</div>
              <div class="font-display text-3xl font-extrabold" :class="admitted ? 'text-emerald-700' : 'text-red-700'">
                {{ total.toFixed(1) }}
              </div>
            </div>
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Puntaje de corte</div>
              <div class="font-display text-3xl font-extrabold">{{ formatScore(career.cutoffScore) }}</div>
            </div>
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Diferencia</div>
              <div class="font-display text-3xl font-extrabold" :class="admitted ? 'text-emerald-700' : 'text-red-700'">
                {{ (difference >= 0 ? '+' : '') + difference.toFixed(1) }}
              </div>
            </div>
          </div>
          <div class="rounded-[14px] bg-white p-4.5">
            <div class="relative mb-2 h-3.5 rounded-full bg-[#eef2f7]">
              <div
                class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500"
                :style="{ width: barScore }"
              ></div>
              <div class="absolute -top-1 h-[22px] w-[3px] bg-ink" :style="{ left: barCutoff }"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Tu ponderado</span>
              <span>Línea negra = corte</span>
            </div>
          </div>
        </div>

        <h3 class="mb-3 font-display text-[17px] font-bold">Desglose ponderado</h3>
        <div class="overflow-hidden rounded-[18px] border border-line bg-white">
          <div class="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-surface px-5.5 py-3 text-xs font-bold text-slate-500">
            <span>Factor</span>
            <span class="text-center">Pond.</span>
            <span class="text-center">Tu puntaje</span>
            <span class="text-right">Aporte</span>
          </div>
          <div
            v-for="row in breakdown"
            :key="row.key"
            class="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-b border-slate-100 px-5.5 py-3.25 last:border-b-0"
          >
            <span class="text-sm font-semibold">{{ row.label }}</span>
            <span class="text-center text-sm text-slate-500">{{ row.weight }}</span>
            <span class="text-center font-display text-sm font-bold">{{ row.score }}</span>
            <span class="text-right font-display text-sm font-bold text-blue-600">{{ row.contribution }}</span>
          </div>
        </div>
      </template>

      <div
        v-else-if="result?.status === 'missing_scores'"
        class="rounded-[20px] border-[1.5px] border-orange-200 bg-orange-50 p-7.5 text-center"
      >
        <div class="mb-2.5 text-[38px]">📋</div>
        <div class="mb-1.5 font-display text-[19px] font-bold text-orange-900">Te faltan puntajes para simular</div>
        <div class="mb-4.5 text-[14.5px] text-orange-900">
          Para <strong>{{ career.name }}</strong> necesitas registrar:
          <strong>{{ missingLabels.join(', ') }}</strong
          >.
        </div>
        <RouterLink
          to="/puntajes"
          class="inline-block rounded-[13px] bg-gradient-to-br from-blue-600 to-sky-500 px-6 py-3 font-display text-[15px] font-semibold text-white"
        >
          Ir a Mis Puntajes →
        </RouterLink>
      </div>
    </template>
  </section>
</template>
