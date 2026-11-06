import type { Carrera, FactorPuntaje, MateriaPaes, PruebaPaes, PuntajesUsuario } from '@/types'
import pruebasData from '@/data/preguntas-paes.json'

export const PRUEBAS_PAES = pruebasData as Record<MateriaPaes, PruebaPaes>

export const MATERIAS_PAES: MateriaPaes[] = ['lectora', 'matematica', 'historia', 'ciencias']

export const FACTOR_KEYS: FactorPuntaje[] = ['nem', 'ranking', 'lectora', 'matematica', 'matematica2', 'historia', 'ciencias']

export const FACTOR_LABEL: Record<FactorPuntaje, string> = {
  nem: 'NEM',
  ranking: 'Ranking',
  lectora: 'Comp. Lectora',
  matematica: 'Comp. Matemática',
  matematica2: 'Comp. Matemática 2',
  historia: 'Historia y Cs.',
  ciencias: 'Ciencias',
}

export const AREA_LABEL: Record<string, string> = {
  salud: 'Salud',
  ingenieria: 'Ingeniería y Tecnología',
  social: 'Ciencias Sociales',
  derecho: 'Derecho',
  educacion: 'Educación',
  negocios: 'Negocios',
  arte: 'Arte y Diseño',
}

export const SIN_DATO = 'No disponible'
export const NO_PUBLICADO = 'No publicado'

export function formatPuntaje(valor: number | null, vacio = NO_PUBLICADO): string {
  return valor == null ? vacio : valor.toFixed(1)
}

/** Etiqueta del factor; si la carrera pide Historia o Ciencias, la fila de historia representa a ambas. */
export function etiquetaFactor(c: Carrera, k: FactorPuntaje): string {
  return k === 'historia' && c.historiaOCiencias ? 'Historia o Ciencias (el mayor)' : FACTOR_LABEL[k]
}

/** Factores que el usuario necesita para postular; con Historia o Ciencias solo cuenta una de las dos. */
export function factoresRequeridos(c: Carrera): FactorPuntaje[] {
  return FACTOR_KEYS.filter((k) => c.pond[k] > 0 && !(c.historiaOCiencias && k === 'ciencias'))
}

/** Factores con ponderación > 0 para una carrera, en orden estándar. */
export function factoresPonderados(c: Carrera): { key: FactorPuntaje; label: string; value: number }[] {
  return factoresRequeridos(c).map((k) => ({ key: k, label: etiquetaFactor(c, k), value: c.pond[k] }))
}

/** Puntaje del usuario para un factor; con Historia o Ciencias usa el mayor de los dos que tenga. */
export function valorFactor(c: Carrera, puntajes: PuntajesUsuario, k: FactorPuntaje): number | null {
  if (k === 'historia' && c.historiaOCiencias) {
    const valores = [puntajes.historia, puntajes.ciencias].filter((v): v is number => v != null)
    return valores.length ? Math.max(...valores) : null
  }
  return puntajes[k]
}

/** Puntaje ponderado del usuario para una carrera (asume puntajes completos). */
export function puntajePonderado(c: Carrera, puntajes: PuntajesUsuario): number {
  let total = 0
  for (const k of factoresRequeridos(c)) total += c.pond[k] * (valorFactor(c, puntajes, k) ?? 0)
  return total / 100
}

/** Puntaje PAES estimado a partir de respuestas correctas (escala 100–1000). */
export function puntajePaes(correctas: number, total: number): number {
  return Math.round(450 + (correctas / total) * 550)
}
