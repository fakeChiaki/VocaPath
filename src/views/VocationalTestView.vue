<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api, errorMessage } from '@/api/client'
import type { VocationalQuestionItem, VocationalResult } from '@/types/api'
import { AREA_LABELS, areaName } from '@/utils/careers'
import { useCatalogStore } from '@/stores/catalog'

const PAGE_SIZE = 6

const catalog = useCatalogStore()

const questions = ref<VocationalQuestionItem[]>([])
const index = ref(0)
const answers = ref<Record<string, string>>({})
const result = ref<VocationalResult | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const visibleCount = ref(PAGE_SIZE)

async function loadQuestions() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get<VocationalQuestionItem[]>('/vocational-tests/questions')
    questions.value = data
  } catch (e) {
    error.value = errorMessage(e, 'No se pudo cargar el test.')
  } finally {
    loading.value = false
  }
}

onMounted(loadQuestions)

const total = computed(() => questions.value.length)
const current = computed(() => questions.value[index.value])
const progress = computed(() => `${((index.value + 1) / Math.max(total.value, 1)) * 100}%`)
const selection = computed(() => (current.value ? answers.value[current.value.id] : undefined))
const isLast = computed(() => index.value === total.value - 1)
const canAdvance = computed(() => selection.value != null && !submitting.value)

function choose(optionId: string) {
  if (!current.value) return
  answers.value = { ...answers.value, [current.value.id]: optionId }
}

function back() {
  if (index.value > 0) index.value -= 1
}

async function next() {
  if (!canAdvance.value) return
  if (!isLast.value) {
    index.value += 1
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const { data } = await api.post<VocationalResult>('/vocational-tests/attempts', {
      answers: questions.value.map((q) => ({ questionId: q.id, optionId: answers.value[q.id] })),
    })
    result.value = data
    visibleCount.value = PAGE_SIZE
    window.scrollTo({ top: 0 })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    submitting.value = false
  }
}

function optionClass(optionId: string): string {
  return selection.value === optionId ? 'border-blue-600 bg-[#e7f0ff]' : 'border-line bg-white hover:border-blue-300'
}

function dotClass(optionId: string): string {
  return selection.value === optionId ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
}

function restart() {
  index.value = 0
  answers.value = {}
  result.value = null
  window.scrollTo({ top: 0 })
}

const topAreaLabel = computed(() => {
  const labels = (result.value?.topAreas ?? []).map((a) => AREA_LABELS[a] ?? a)
  return labels.length > 1 ? `${labels.slice(0, -1).join(', ')} y ${labels.at(-1)}` : (labels[0] ?? '')
})

const recommendations = computed(() =>
  (result.value?.recommendedCareers ?? []).slice(0, visibleCount.value).map((career) => ({
    career,
    reason: `Encaja con tu interés en ${areaName(career).toLowerCase()}${career.profile ? `: ${career.profile.split('.')[0]}` : ''}.`,
  })),
)
const hiddenCount = computed(() => (result.value?.recommendedCareers.length ?? 0) - visibleCount.value)
</script>

<template>
  <section class="mx-auto max-w-[760px] animate-vp-fade">
    <template v-if="!result">
      <div class="mb-6.5 text-center">
        <span class="text-[13px] font-semibold text-blue-600">TEST VOCACIONAL</span>
        <h1 class="mt-1.5 font-display text-[30px] font-bold tracking-tight">Descubre tu carrera ideal</h1>
      </div>

      <p v-if="loading" class="text-center text-sm text-slate-500">Cargando preguntas…</p>
      <div v-else-if="error && !current" class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800" role="alert">
        {{ error }}
        <button class="ml-3 cursor-pointer border-none bg-transparent font-semibold text-rose-700 underline" @click="loadQuestions">
          Reintentar
        </button>
      </div>

      <template v-else-if="current">
        <div class="mb-6.5 flex items-center gap-3.5">
          <div class="h-2 flex-1 overflow-hidden rounded-full bg-line">
            <div
              class="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-[width] duration-300"
              :style="{ width: progress }"
            ></div>
          </div>
          <span class="text-[13px] font-semibold whitespace-nowrap text-slate-500">{{ index + 1 }} / {{ total }}</span>
        </div>

        <div class="rounded-[22px] border border-line bg-white p-8.5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <h2 class="mb-6 font-display text-[23px] leading-tight font-bold">{{ current.text }}</h2>
          <div class="flex flex-col gap-3">
            <button
              v-for="option in current.options"
              :key="option.id"
              class="flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] px-4.5 py-4 text-left transition-all duration-100"
              :class="optionClass(option.id)"
              @click="choose(option.id)"
            >
              <span class="flex size-5.5 shrink-0 items-center justify-center rounded-full border-2" :class="dotClass(option.id)">
                <span v-if="selection === option.id" class="size-2 rounded-full bg-white"></span>
              </span>
              <span class="text-base font-medium">{{ option.label }}</span>
            </button>
          </div>

          <p v-if="error" class="mt-4 rounded-[12px] bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{{ error }}</p>

          <div class="mt-6.5 flex justify-between">
            <button
              :disabled="index === 0"
              class="rounded-xl border-[1.5px] border-slate-200 bg-white px-5.5 py-3 font-display text-[15px] font-semibold text-slate-500"
              :class="index === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-slate-300'"
              @click="back"
            >
              ← Atrás
            </button>
            <button
              :disabled="!canAdvance"
              class="rounded-xl border-none px-7 py-3 font-display text-[15px] font-semibold text-white"
              :class="canAdvance ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-slate-300'"
              @click="next"
            >
              {{ submitting ? 'Enviando…' : isLast ? 'Ver resultados' : 'Siguiente →' }}
            </button>
          </div>
        </div>
      </template>
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
          v-for="r in recommendations"
          :key="r.career.id"
          :to="`/carreras/${r.career.id}`"
          class="flex items-start gap-4.5 rounded-[18px] border border-line bg-white p-5.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
        >
          <span
            class="flex size-11.5 shrink-0 items-center justify-center rounded-[13px] font-display text-[13px] font-extrabold text-white"
            :style="{ background: catalog.universityColor(r.career.universityName) }"
          >
            {{ r.career.universityName }}
          </span>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="font-display text-lg font-bold">{{ r.career.name }}</span>
              <span class="rounded-full bg-[#eff6ff] px-2.25 py-0.75 text-[11px] font-semibold text-blue-600">
                {{ areaName(r.career) }}
              </span>
            </div>
            <div class="mt-1.5 text-sm leading-relaxed text-slate-500">{{ r.reason }}</div>
          </div>
          <span class="text-xl text-slate-400">→</span>
        </RouterLink>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button
          v-if="hiddenCount > 0"
          class="cursor-pointer rounded-[13px] border-[1.5px] border-blue-200 bg-[#eff6ff] px-6.5 py-3 font-display text-[15px] font-semibold text-blue-700"
          @click="visibleCount += PAGE_SIZE"
        >
          Ver más carreras ({{ hiddenCount }})
        </button>
        <button
          class="cursor-pointer rounded-[13px] border-[1.5px] border-[#cdd9ea] bg-white px-6.5 py-3 font-display text-[15px] font-semibold text-slate-700"
          @click="restart"
        >
          ↺ Repetir test
        </button>
      </div>
    </template>
  </section>
</template>
