import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { FactorPuntaje, MateriaPaes, MencionCiencias, PuntajesUsuario, RespuestasPaes } from '@/types'
import { loadJSON, saveJSON } from '@/utils/storage'

const KEY_SCORES = 'vp_scores'
const KEY_COMPLETED = 'vp_paesdone'
const KEY_ANSWERS = 'vp_paes_answers'
const KEY_MENCION = 'vp_paes_mencion'

const EMPTY_SCORES: PuntajesUsuario = {
  lectora: null,
  matematica: null,
  historia: null,
  ciencias: null,
  nem: null,
  ranking: null,
}

export const useScoresStore = defineStore('scores', () => {
  const puntajes = ref<PuntajesUsuario>({ ...EMPTY_SCORES, ...loadJSON<Partial<PuntajesUsuario>>(KEY_SCORES, {}) })
  const paesCompletadas = ref<MateriaPaes[]>(loadJSON<MateriaPaes[]>(KEY_COMPLETED, []))
  const respuestasGuardadas = ref<Partial<Record<MateriaPaes, RespuestasPaes>>>(
    loadJSON<Partial<Record<MateriaPaes, RespuestasPaes>>>(KEY_ANSWERS, {}),
  )
  const mencionesRendidas = ref<Partial<Record<MateriaPaes, MencionCiencias>>>(
    loadJSON<Partial<Record<MateriaPaes, MencionCiencias>>>(KEY_MENCION, {}),
  )

  const registrados = computed(() => Object.values(puntajes.value).filter((v) => v != null).length)

  function persistir(): void {
    saveJSON(KEY_SCORES, puntajes.value)
  }

  function setPuntaje(factor: FactorPuntaje, valor: number | null): void {
    const num = valor == null || Number.isNaN(valor) ? null : Math.max(100, Math.min(1000, Math.round(valor)))
    puntajes.value = { ...puntajes.value, [factor]: num }
    persistir()
  }

  function borrarPuntaje(factor: FactorPuntaje): void {
    puntajes.value = { ...puntajes.value, [factor]: null }
    persistir()
  }

  function estaRendida(materia: MateriaPaes): boolean {
    return paesCompletadas.value.includes(materia)
  }

  /** Guarda el resultado de una prueba tipo PAES: puntaje, materia rendida, respuestas para revisión y mención (si aplica). */
  function guardarResultadoPaes(
    materia: MateriaPaes,
    respuestas: RespuestasPaes,
    puntaje: number,
    mencion?: MencionCiencias,
  ): void {
    puntajes.value = { ...puntajes.value, [materia]: puntaje }
    if (!paesCompletadas.value.includes(materia)) paesCompletadas.value = [...paesCompletadas.value, materia]
    respuestasGuardadas.value = { ...respuestasGuardadas.value, [materia]: respuestas }
    if (mencion) {
      mencionesRendidas.value = { ...mencionesRendidas.value, [materia]: mencion }
      saveJSON(KEY_MENCION, mencionesRendidas.value)
    }
    persistir()
    saveJSON(KEY_COMPLETED, paesCompletadas.value)
    saveJSON(KEY_ANSWERS, respuestasGuardadas.value)
  }

  return {
    puntajes,
    paesCompletadas,
    respuestasGuardadas,
    mencionesRendidas,
    registrados,
    setPuntaje,
    borrarPuntaje,
    estaRendida,
    guardarResultadoPaes,
  }
})
