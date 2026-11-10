import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api, errorMessage } from '@/api/client'
import type { PaesSubject, ScoreFactor, UserScores } from '@/types'
import type { UserScore } from '@/types/api'

const LEGACY_KEYS = ['vp_scores', 'vp_paesdone', 'vp_paes_answers', 'vp_paes_mencion']

function emptyScores(): UserScores {
  return { lectora: null, matematica: null, matematica2: null, historia: null, ciencias: null, nem: null, ranking: null }
}

export const useScoresStore = defineStore('scores', () => {
  const values = ref<UserScores>(emptyScores())
  const sources = ref<Partial<Record<ScoreFactor, UserScore['source']>>>({})
  const loaded = ref(false)
  const error = ref('')

  const registeredCount = computed(() => Object.values(values.value).filter((v) => v != null).length)

  async function load() {
    if (loaded.value) return
    try {
      const { data } = await api.get<UserScore[]>('/scores')
      values.value = emptyScores()
      sources.value = {}
      for (const s of data) {
        values.value[s.factor] = s.value
        sources.value[s.factor] = s.source
      }
      loaded.value = true
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key))
    } catch (e) {
      error.value = errorMessage(e, 'No se pudieron cargar tus puntajes.')
    }
  }

  async function set(factor: ScoreFactor, value: number) {
    const score = Math.max(100, Math.min(1000, Math.round(value)))
    const previous = { value: values.value[factor], source: sources.value[factor] }
    values.value[factor] = score
    sources.value[factor] = 'manual'
    try {
      await api.put(`/scores/${factor}`, { value: score })
    } catch (e) {
      values.value[factor] = previous.value
      sources.value[factor] = previous.source
      error.value = errorMessage(e, 'No se pudo guardar el puntaje.')
    }
  }

  async function remove(factor: ScoreFactor) {
    const previous = { value: values.value[factor], source: sources.value[factor] }
    values.value[factor] = null
    delete sources.value[factor]
    try {
      await api.delete(`/scores/${factor}`)
    } catch (e) {
      values.value[factor] = previous.value
      sources.value[factor] = previous.source
      error.value = errorMessage(e, 'No se pudo eliminar el puntaje.')
    }
  }

  function applyAttempt(subject: PaesSubject, score: number) {
    values.value[subject] = score
    sources.value[subject] = 'paes_attempt'
  }

  function hasAttempt(subject: PaesSubject) {
    return sources.value[subject] === 'paes_attempt'
  }

  function reset() {
    values.value = emptyScores()
    sources.value = {}
    loaded.value = false
    error.value = ''
  }

  return { values, loaded, error, registeredCount, load, set, remove, applyAttempt, hasAttempt, reset }
})
