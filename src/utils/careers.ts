import type { PaesSubject, PaesTest, ScoreFactor, UserScores } from '@/types'
import type { Career } from '@/types/api'
import testsData from '@/data/preguntas-paes.json'

export const PAES_TESTS = testsData as Record<PaesSubject, PaesTest>

export const PAES_SUBJECTS: PaesSubject[] = ['lectora', 'matematica', 'historia', 'ciencias']

export const SCORE_FACTORS: ScoreFactor[] = ['nem', 'ranking', 'lectora', 'matematica', 'matematica2', 'historia', 'ciencias']

export const FACTOR_LABELS: Record<ScoreFactor, string> = {
  nem: 'NEM',
  ranking: 'Ranking',
  lectora: 'Comp. Lectora',
  matematica: 'Comp. Matemática',
  matematica2: 'Comp. Matemática 2',
  historia: 'Historia y Cs.',
  ciencias: 'Ciencias',
}

export const AREA_LABELS: Record<string, string> = {
  salud: 'Salud',
  ingenieria: 'Ingeniería y Tecnología',
  social: 'Ciencias Sociales',
  derecho: 'Derecho',
  educacion: 'Educación',
  negocios: 'Negocios',
  arte: 'Arte y Diseño',
}

export const NO_DATA = 'No disponible'
export const NOT_PUBLISHED = 'No publicado'

export function formatScore(value: number | null, empty = NOT_PUBLISHED): string {
  return value == null ? empty : value.toFixed(1)
}

export function areaName(career: Career): string {
  return (career.areaCode && AREA_LABELS[career.areaCode]) || career.areaLabel || 'Sin área'
}

/** Etiqueta del factor; si la carrera pide Historia o Ciencias, la fila de historia representa a ambas. */
export function factorLabel(career: Career, factor: ScoreFactor): string {
  return factor === 'historia' && career.weights.historiaOCiencias ? 'Historia o Ciencias (el mayor)' : FACTOR_LABELS[factor]
}

/** Factores que el usuario necesita para postular; con Historia o Ciencias solo cuenta una de las dos. */
export function requiredFactors(career: Career): ScoreFactor[] {
  return SCORE_FACTORS.filter((k) => career.weights[k] > 0 && !(career.weights.historiaOCiencias && k === 'ciencias'))
}

/** Factores con ponderación > 0 para una carrera, en orden estándar. */
export function weightedFactors(career: Career): { key: ScoreFactor; label: string; value: number }[] {
  return requiredFactors(career).map((k) => ({ key: k, label: factorLabel(career, k), value: career.weights[k] }))
}

/** Puntaje del usuario para un factor; con Historia o Ciencias usa el mayor de los dos que tenga. */
export function factorValue(career: Career, scores: UserScores, factor: ScoreFactor): number | null {
  if (factor === 'historia' && career.weights.historiaOCiencias) {
    const values = [scores.historia, scores.ciencias].filter((v): v is number => v != null)
    return values.length ? Math.max(...values) : null
  }
  return scores[factor]
}

/** Puntaje ponderado del usuario para una carrera (asume puntajes completos). */
export function weightedScore(career: Career, scores: UserScores): number {
  let total = 0
  for (const k of requiredFactors(career)) total += career.weights[k] * (factorValue(career, scores, k) ?? 0)
  return total / 100
}

/** Puntaje PAES estimado a partir de respuestas correctas (escala 100–1000). */
export function paesScore(correct: number, total: number): number {
  return Math.round(450 + (correct / total) * 550)
}
