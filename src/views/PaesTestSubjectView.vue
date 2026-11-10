<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, errorMessage } from '@/api/client'
import type { ScienceMention } from '@/types'
import type { PaesAttemptResult, PaesQuestionItem } from '@/types/api'
import { MENTION_META, SUBJECT_META, isPaesSubject, isScienceMention } from '@/utils/paes'
import { useScoresStore } from '@/stores/scores'

const route = useRoute()
const router = useRouter()
const scores = useScoresStore()

const subject = computed(() => (isPaesSubject(route.params.subject) ? route.params.subject : null))
const mention = computed<ScienceMention | null>(() => (isScienceMention(route.query.mention) ? route.query.mention : null))
const isReview = computed(() => route.query.review != null)
const needsMention = computed(() => subject.value === 'ciencias' && !mention.value)

const questions = ref<PaesQuestionItem[]>([])
const answers = ref<Record<string, number>>({})
const result = ref<PaesAttemptResult | null>(null)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const mentionParams = () => (mention.value ? { mencion: mention.value } : {})

async function latestScienceMention(): Promise<ScienceMention | null> {
  const attempts = await Promise.allSettled(
    (Object.keys(MENTION_META) as ScienceMention[]).map(async (m) => {
      const { data } = await api.get<PaesAttemptResult & { createdAt: string }>('/paes-tests/attempts/ciencias', {
        params: { mencion: m },
      })
      return { mention: m, createdAt: data.createdAt }
    }),
  )
  const found = attempts.flatMap((a) => (a.status === 'fulfilled' ? [a.value] : []))
  found.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return found[0]?.mention ?? null
}

async function load() {
  error.value = ''
  result.value = null
  answers.value = {}
  questions.value = []
  if (!subject.value) {
    router.replace('/prueba-paes')
    return
  }
  loading.value = true
  try {
    if (needsMention.value) {
      if (!isReview.value) return
      const latest = await latestScienceMention()
      if (!latest) error.value = 'No hay una prueba rendida para esta materia.'
      else router.replace({ query: { review: '1', mention: latest } })
    } else if (isReview.value) {
      const { data } = await api.get<PaesAttemptResult>(`/paes-tests/attempts/${subject.value}`, { params: mentionParams() })
      result.value = data
    } else {
      const { data } = await api.get<PaesQuestionItem[]>('/paes-tests/questions', {
        params: { subject: subject.value, ...mentionParams() },
      })
      questions.value = data
    }
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(() => [route.params.subject, route.query.review, route.query.mention], load, { immediate: true })

function chooseMention(m: ScienceMention) {
  router.push({ query: { mention: m } })
}

const items = computed(() =>
  result.value
    ? result.value.review.map((r) => ({
        id: r.questionId,
        text: r.text,
        options: r.options,
        correctIndex: r.correctIndex as number | null,
        selectedIndex: r.selectedIndex as number | null,
      }))
    : questions.value.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctIndex: null as number | null,
        selectedIndex: (answers.value[q.id] ?? null) as number | null,
      })),
)

const total = computed(() => items.value.length)
const answered = computed(() => (result.value ? total.value : Object.keys(answers.value).length))
const canSubmit = computed(() => !result.value && !submitting.value && total.value > 0 && answered.value === total.value)

const label = computed(() => {
  if (!subject.value) return ''
  const base = SUBJECT_META[subject.value].label
  return mention.value ? `${base} · Mención ${MENTION_META[mention.value].label}` : base
})
const icon = computed(() => {
  if (!subject.value) return ''
  return mention.value ? MENTION_META[mention.value].icon : SUBJECT_META[subject.value].icon
})

function choose(questionId: string, option: number) {
  if (result.value) return
  answers.value = { ...answers.value, [questionId]: option }
}

async function submit() {
  if (!canSubmit.value || !subject.value) return
  submitting.value = true
  error.value = ''
  try {
    const { data } = await api.post<PaesAttemptResult>('/paes-tests/attempts', {
      subject: subject.value,
      mencion: mention.value ?? 'ninguna',
      answers: questions.value.map((q) => ({ questionId: q.id, selectedIndex: answers.value[q.id]! })),
    })
    result.value = data
    scores.applyAttempt(subject.value, data.score)
    window.scrollTo({ top: 0 })
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    submitting.value = false
  }
}

function retry() {
  window.scrollTo({ top: 0 })
  if (isReview.value) {
    router.push({ query: mention.value ? { mention: mention.value } : {} })
    return
  }
  result.value = null
  answers.value = {}
}

function optionClass(item: (typeof items.value)[number], option: number): string {
  if (!result.value) {
    return item.selectedIndex === option ? 'border-blue-600 bg-[#e7f0ff]' : 'border-line bg-white hover:border-blue-300'
  }
  if (option === item.correctIndex) return 'border-emerald-500 bg-emerald-50 text-emerald-700'
  if (option === item.selectedIndex) return 'border-red-500 bg-red-50 text-red-700'
  return 'border-line bg-white'
}

function optionMark(item: (typeof items.value)[number], option: number): string {
  if (!result.value) return ''
  if (option === item.correctIndex) return '✓'
  if (option === item.selectedIndex) return '✗'
  return ''
}
</script>

<template>
  <section v-if="subject" class="animate-vp-fade">
    <RouterLink
      to="/prueba-paes"
      class="mb-4.5 inline-block text-sm font-semibold text-slate-500 hover:text-slate-700"
    >
      ← Volver a materias
    </RouterLink>

    <!-- Selector de mención (Ciencias) -->
    <div v-if="needsMention" class="max-w-[760px]">
      <div class="mb-2 flex items-center gap-3.5">
        <span class="flex size-11.5 items-center justify-center rounded-[13px] bg-surface text-2xl">
          {{ SUBJECT_META[subject].icon }}
        </span>
        <div>
          <h1 class="font-display text-[26px] font-bold">{{ SUBJECT_META[subject].label }}</h1>
          <div class="text-[13px] text-slate-500">
            Como en la PAES real, debes elegir una mención para rendir esta prueba.
          </div>
        </div>
      </div>
      <p v-if="loading" class="mt-4.5 text-sm text-slate-500">Buscando tu prueba…</p>
      <p v-else-if="error" class="mt-4.5 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-800" role="alert">{{ error }}</p>
      <div v-else class="mt-4.5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          v-for="(m, key) in MENTION_META"
          :key="key"
          class="cursor-pointer rounded-[18px] border border-line bg-white p-6 text-left transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
          @click="chooseMention(key)"
        >
          <span class="flex size-13 items-center justify-center rounded-[14px] bg-surface text-[26px]">
            {{ m.icon }}
          </span>
          <div class="mt-4 mb-1 font-display text-[19px] font-bold">{{ m.label }}</div>
          <div class="text-[13px] text-slate-500">Rendir con esta mención →</div>
        </button>
      </div>
    </div>

    <!-- Rendición / revisión -->
    <div v-else class="max-w-[760px]">
      <div class="mb-2 flex items-center gap-3.5">
        <span class="flex size-11.5 items-center justify-center rounded-[13px] bg-surface text-2xl">
          {{ icon }}
        </span>
        <div>
          <h1 class="font-display text-[26px] font-bold">{{ label }}</h1>
          <div class="text-[13px] text-slate-500">{{ answered }} de {{ total }} respondidas</div>
        </div>
      </div>

      <p v-if="loading" class="my-4.5 text-sm text-slate-500">Cargando preguntas…</p>
      <p v-if="error" class="my-4.5 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-800" role="alert">{{ error }}</p>

      <div
        v-if="result"
        class="my-4.5 flex items-center justify-between rounded-[18px] bg-gradient-to-br from-blue-600 to-sky-500 px-6.5 py-5.5 text-white"
      >
        <div>
          <div class="text-[13px] opacity-90">Respuestas correctas: {{ result.correctCount }} / {{ result.totalCount }}</div>
          <div class="font-display text-3xl font-extrabold">Puntaje: {{ result.score }}</div>
        </div>
        <button
          class="cursor-pointer rounded-xl border-none bg-white/20 px-5 py-2.75 font-display text-sm font-semibold text-white"
          @click="retry"
        >
          ↺ Reintentar
        </button>
      </div>

      <div class="mt-4.5 flex flex-col gap-4">
        <div v-for="(item, i) in items" :key="item.id" class="rounded-[18px] border border-line bg-white p-6">
          <div class="mb-4 font-display text-[17px] font-bold">{{ i + 1 }}. {{ item.text }}</div>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              v-for="(option, oi) in item.options"
              :key="oi"
              class="flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border-[1.5px] px-4 py-3.25 text-left transition-colors"
              :class="optionClass(item, oi)"
              @click="choose(item.id, oi)"
            >
              <span class="text-[14.5px] font-medium">{{ option }}</span>
              <span class="text-[15px] font-bold">{{ optionMark(item, oi) }}</span>
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="!result && total > 0"
        :disabled="!canSubmit"
        class="mt-4.5 w-full rounded-[14px] border-none py-3.75 font-display text-base font-semibold text-white"
        :class="canSubmit ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-slate-300'"
        @click="submit"
      >
        {{
          submitting
            ? 'Enviando…'
            : canSubmit
              ? 'Finalizar y ver resultados'
              : 'Responde todas las preguntas para continuar'
        }}
      </button>
    </div>
  </section>
</template>
