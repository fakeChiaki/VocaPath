<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MateriaPaes, MencionCiencias, PreguntaPaes, RespuestasPaes } from '@/types'
import { MATERIAS_PAES, PRUEBAS_PAES, puntajePaes } from '@/utils/carreras'
import { useScoresStore } from '@/stores/scores'
import CacheWarning from '@/components/layout/CacheWarning.vue'

const route = useRoute()
const router = useRouter()
const scores = useScoresStore()

const materia = computed(() => route.params.materia as MateriaPaes)
const prueba = computed(() => PRUEBAS_PAES[materia.value])

const mencion = computed<MencionCiencias | null>(() => {
  const m = route.query.mencion
  const menciones = prueba.value?.menciones
  return typeof m === 'string' && menciones && m in menciones ? (m as MencionCiencias) : null
})
const requiereMencion = computed(() => !!prueba.value?.menciones && !mencion.value)

const preguntas = computed<PreguntaPaes[]>(() => {
  const p = prueba.value
  if (!p) return []
  if (p.menciones) return mencion.value ? p.menciones[mencion.value].qs : []
  return p.qs ?? []
})

const etiqueta = computed(() => {
  const p = prueba.value
  if (p?.menciones && mencion.value) return `${p.label} · Mención ${p.menciones[mencion.value].label}`
  return p?.label ?? ''
})
const icono = computed(() => {
  const p = prueba.value
  if (p?.menciones && mencion.value) return p.menciones[mencion.value].icon
  return p?.icon ?? ''
})

const respuestas = ref<RespuestasPaes>({})
const finalizada = ref(false)

function iniciar() {
  if (!MATERIAS_PAES.includes(materia.value)) {
    router.replace('/prueba-paes')
    return
  }
  // Al revisar ciencias, restaurar la mención con la que se rindió
  if (requiereMencion.value && route.query.revisar != null) {
    const rendida = scores.mencionesRendidas[materia.value]
    if (rendida) {
      router.replace({ query: { revisar: '1', mencion: rendida } })
      return
    }
  }
  const guardadas = scores.respuestasGuardadas[materia.value]
  if (route.query.revisar != null && guardadas && scores.estaRendida(materia.value) && !requiereMencion.value) {
    respuestas.value = { ...guardadas }
    finalizada.value = true
  } else {
    respuestas.value = {}
    finalizada.value = false
  }
}

watch(() => [route.params.materia, route.query.revisar, route.query.mencion], iniciar, { immediate: true })

function elegirMencion(m: MencionCiencias) {
  router.push({ query: { mencion: m } })
}

const total = computed(() => preguntas.value.length)
const respondidas = computed(() => Object.keys(respuestas.value).length)
const correctas = computed(() => preguntas.value.filter((q, i) => respuestas.value[i] === q.c).length)
const puntaje = computed(() => puntajePaes(correctas.value, total.value))
const puedeEnviar = computed(() => total.value > 0 && respondidas.value === total.value)

function elegir(pregunta: number, opcion: number) {
  if (finalizada.value) return
  respuestas.value = { ...respuestas.value, [pregunta]: opcion }
}

function finalizar() {
  if (!puedeEnviar.value) return
  scores.guardarResultadoPaes(materia.value, { ...respuestas.value }, puntaje.value, mencion.value ?? undefined)
  finalizada.value = true
  window.scrollTo({ top: 0 })
}

function reintentar() {
  respuestas.value = {}
  finalizada.value = false
  window.scrollTo({ top: 0 })
}

function claseOpcion(pregunta: number, opcion: number): string {
  const sel = respuestas.value[pregunta]
  if (!finalizada.value) {
    return sel === opcion ? 'border-blue-600 bg-[#e7f0ff]' : 'border-line bg-white hover:border-blue-300'
  }
  const correcta = preguntas.value[pregunta]!.c
  if (opcion === correcta) return 'border-emerald-500 bg-emerald-50 text-emerald-700'
  if (sel === opcion) return 'border-red-500 bg-red-50 text-red-700'
  return 'border-line bg-white'
}

function marcaOpcion(pregunta: number, opcion: number): string {
  if (!finalizada.value) return ''
  const correcta = preguntas.value[pregunta]!.c
  if (opcion === correcta) return '✓'
  if (respuestas.value[pregunta] === opcion) return '✗'
  return ''
}
</script>

<template>
  <section v-if="prueba" class="animate-vp-fade">
    <RouterLink
      to="/prueba-paes"
      class="mb-4.5 inline-block text-sm font-semibold text-slate-500 hover:text-slate-700"
    >
      ← Volver a materias
    </RouterLink>

    <!-- Selector de mención (Ciencias) -->
    <div v-if="requiereMencion" class="max-w-[760px]">
      <div class="mb-2 flex items-center gap-3.5">
        <span class="flex size-11.5 items-center justify-center rounded-[13px] bg-surface text-2xl">
          {{ prueba.icon }}
        </span>
        <div>
          <h1 class="font-display text-[26px] font-bold">{{ prueba.label }}</h1>
          <div class="text-[13px] text-slate-500">
            Como en la PAES real, debes elegir una mención para rendir esta prueba.
          </div>
        </div>
      </div>
      <div class="mt-4.5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          v-for="(m, key) in prueba.menciones"
          :key="key"
          class="cursor-pointer rounded-[18px] border border-line bg-white p-6 text-left transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
          @click="elegirMencion(key)"
        >
          <span class="flex size-13 items-center justify-center rounded-[14px] bg-surface text-[26px]">
            {{ m.icon }}
          </span>
          <div class="mt-4 mb-1 font-display text-[19px] font-bold">{{ m.label }}</div>
          <div class="text-[13px] text-slate-500">
            {{ scores.mencionesRendidas[materia] === key ? 'Mención rendida anteriormente' : 'Rendir con esta mención' }}
            →
          </div>
        </button>
      </div>
    </div>

    <!-- Rendición / revisión -->
    <div v-else class="max-w-[760px]">
      <div class="mb-2 flex items-center gap-3.5">
        <span class="flex size-11.5 items-center justify-center rounded-[13px] bg-surface text-2xl">
          {{ icono }}
        </span>
        <div>
          <h1 class="font-display text-[26px] font-bold">{{ etiqueta }}</h1>
          <div class="text-[13px] text-slate-500">{{ respondidas }} de {{ total }} respondidas</div>
        </div>
      </div>

      <div
        v-if="finalizada"
        class="my-4.5 flex items-center justify-between rounded-[18px] bg-gradient-to-br from-blue-600 to-sky-500 px-6.5 py-5.5 text-white"
      >
        <div>
          <div class="text-[13px] opacity-90">Respuestas correctas: {{ correctas }} / {{ total }}</div>
          <div class="font-display text-3xl font-extrabold">Puntaje: {{ puntaje }}</div>
        </div>
        <button
          class="cursor-pointer rounded-xl border-none bg-white/20 px-5 py-2.75 font-display text-sm font-semibold text-white"
          @click="reintentar"
        >
          ↺ Reintentar
        </button>
      </div>

      <CacheWarning
        v-else
        class="my-4.5"
        mensaje="Tu puntaje se guardará en el caché del navegador. En modo incógnito o al limpiar el caché se perderá."
      />

      <div class="mt-4.5 flex flex-col gap-4">
        <div v-for="(q, i) in preguntas" :key="i" class="rounded-[18px] border border-line bg-white p-6">
          <div class="mb-4 font-display text-[17px] font-bold">{{ i + 1 }}. {{ q.t }}</div>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              v-for="(opcion, oi) in q.o"
              :key="oi"
              class="flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border-[1.5px] px-4 py-3.25 text-left transition-colors"
              :class="claseOpcion(i, oi)"
              @click="elegir(i, oi)"
            >
              <span class="text-[14.5px] font-medium">{{ opcion }}</span>
              <span class="text-[15px] font-bold">{{ marcaOpcion(i, oi) }}</span>
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="!finalizada"
        :disabled="!puedeEnviar"
        class="mt-4.5 w-full rounded-[14px] border-none py-3.75 font-display text-base font-semibold text-white"
        :class="puedeEnviar ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-slate-300'"
        @click="finalizar"
      >
        {{ puedeEnviar ? 'Finalizar y ver resultados' : 'Responde todas las preguntas para continuar' }}
      </button>
    </div>
  </section>
</template>
