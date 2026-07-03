<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  CARRERAS,
  FACTOR_LABEL,
  factoresRequeridos,
  getCarrera,
  puntajePonderado,
} from '@/utils/carreras'
import { useScoresStore } from '@/stores/scores'

const route = useRoute()
const scores = useScoresStore()

const carreraId = ref(typeof route.query.carrera === 'string' ? route.query.carrera : '')

const carrera = computed(() => getCarrera(carreraId.value))
const requeridos = computed(() => (carrera.value ? factoresRequeridos(carrera.value) : []))
const faltantes = computed(() => requeridos.value.filter((k) => scores.puntajes[k] == null))
const listo = computed(() => !!carrera.value && faltantes.value.length === 0)

const total = computed(() => (listo.value ? puntajePonderado(carrera.value!, scores.puntajes) : 0))
const diferencia = computed(() => total.value - (carrera.value?.ultimo ?? 0))
const admitido = computed(() => listo.value && diferencia.value >= 0)

const desglose = computed(() => {
  if (!listo.value || !carrera.value) return []
  return requeridos.value.map((k) => ({
    key: k,
    label: FACTOR_LABEL[k],
    pond: `${carrera.value!.pond[k]}%`,
    puntaje: scores.puntajes[k]!,
    aporte: ((carrera.value!.pond[k] * scores.puntajes[k]!) / 100).toFixed(1),
  }))
})

const barTu = computed(() => `${Math.min(100, (total.value / 1100) * 100)}%`)
const barCorte = computed(() => `${Math.min(100, ((carrera.value?.ultimo ?? 0) / 1100) * 100)}%`)
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
      <label for="sim-carrera" class="text-[13px] font-semibold text-slate-500">Elige la carrera a simular</label>
      <select
        id="sim-carrera"
        v-model="carreraId"
        class="mt-2 w-full cursor-pointer rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3.5 font-display text-[15px] font-semibold text-ink"
      >
        <option value="">— Selecciona una carrera —</option>
        <option v-for="c in CARRERAS" :key="c.id" :value="c.id">{{ c.nombre }} · {{ c.uni }}</option>
      </select>
    </div>

    <template v-if="carrera">
      <template v-if="listo">
        <div
          class="mb-4.5 rounded-[20px] border-[1.5px] p-7"
          :class="admitido ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'"
        >
          <div class="mb-5 flex items-center gap-3.5">
            <span class="text-[40px]">{{ admitido ? '🎉' : '📉' }}</span>
            <div>
              <div class="font-display text-2xl font-extrabold" :class="admitido ? 'text-emerald-700' : 'text-red-700'">
                {{ admitido ? '¡Alcanzas el puntaje de corte!' : 'Aún no alcanzas el corte' }}
              </div>
              <div class="text-sm text-slate-600">{{ carrera.nombre }} · {{ carrera.uni }}</div>
            </div>
          </div>
          <div class="mb-4.5 flex flex-col gap-4 sm:flex-row">
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Tu puntaje ponderado</div>
              <div class="font-display text-3xl font-extrabold" :class="admitido ? 'text-emerald-700' : 'text-red-700'">
                {{ total.toFixed(1) }}
              </div>
            </div>
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Puntaje de corte</div>
              <div class="font-display text-3xl font-extrabold">{{ carrera.ultimo.toFixed(1) }}</div>
            </div>
            <div class="flex-1 rounded-[14px] bg-white p-4">
              <div class="text-xs text-slate-500">Diferencia</div>
              <div class="font-display text-3xl font-extrabold" :class="admitido ? 'text-emerald-700' : 'text-red-700'">
                {{ (diferencia >= 0 ? '+' : '') + diferencia.toFixed(1) }}
              </div>
            </div>
          </div>
          <div class="rounded-[14px] bg-white p-4.5">
            <div class="relative mb-2 h-3.5 rounded-full bg-[#eef2f7]">
              <div
                class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500"
                :style="{ width: barTu }"
              ></div>
              <div class="absolute -top-1 h-[22px] w-[3px] bg-ink" :style="{ left: barCorte }"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Tu ponderado</span>
              <span>Línea negra = corte</span>
            </div>
          </div>
        </div>

        <h3 class="mb-3 font-display text-[17px] font-bold">Desglose ponderado</h3>
        <div class="overflow-hidden rounded-[18px] border border-line bg-white">
          <div
            class="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-surface px-5.5 py-3 text-xs font-bold text-slate-500"
          >
            <span>Factor</span>
            <span class="text-center">Pond.</span>
            <span class="text-center">Tu puntaje</span>
            <span class="text-right">Aporte</span>
          </div>
          <div
            v-for="fila in desglose"
            :key="fila.key"
            class="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center border-b border-slate-100 px-5.5 py-3.25 last:border-b-0"
          >
            <span class="text-sm font-semibold">{{ fila.label }}</span>
            <span class="text-center text-sm text-slate-500">{{ fila.pond }}</span>
            <span class="text-center font-display text-sm font-bold">{{ fila.puntaje }}</span>
            <span class="text-right font-display text-sm font-bold text-blue-600">{{ fila.aporte }}</span>
          </div>
        </div>
      </template>

      <div v-else class="rounded-[20px] border-[1.5px] border-orange-200 bg-orange-50 p-7.5 text-center">
        <div class="mb-2.5 text-[38px]">📋</div>
        <div class="mb-1.5 font-display text-[19px] font-bold text-orange-900">Te faltan puntajes para simular</div>
        <div class="mb-4.5 text-[14.5px] text-orange-900">
          Para <strong>{{ carrera.nombre }}</strong> necesitas registrar:
          <strong>{{ faltantes.map((k) => FACTOR_LABEL[k]).join(', ') }}</strong
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
