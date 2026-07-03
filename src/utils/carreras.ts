import type { Carrera, FactorPuntaje, MateriaPaes, PruebaPaes, PuntajesUsuario, Universidad } from '@/types'
import carrerasData from '@/data/carreras.json'
import universidadesData from '@/data/universidades.json'
import pruebasData from '@/data/preguntas-paes.json'

export const CARRERAS = carrerasData as Carrera[]
export const UNIVERSIDADES = universidadesData as Universidad[]
export const PRUEBAS_PAES = pruebasData as Record<MateriaPaes, PruebaPaes>

export const MATERIAS_PAES: MateriaPaes[] = ['lectora', 'matematica', 'historia', 'ciencias']

export const FACTOR_KEYS: FactorPuntaje[] = ['nem', 'ranking', 'lectora', 'matematica', 'historia', 'ciencias']

export const FACTOR_LABEL: Record<FactorPuntaje, string> = {
  nem: 'NEM',
  ranking: 'Ranking',
  lectora: 'Comp. Lectora',
  matematica: 'Comp. Matemática',
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

export function getCarrera(id: string | null | undefined): Carrera | undefined {
  return CARRERAS.find((c) => c.id === id)
}

export function getUniversidad(name: string | null | undefined): Universidad | undefined {
  return UNIVERSIDADES.find((u) => u.name === name)
}

export function uniColor(name: string): string {
  return getUniversidad(name)?.color ?? '#2563eb'
}

/** Factores con ponderación > 0 para una carrera, en orden estándar. */
export function factoresPonderados(c: Carrera): { key: FactorPuntaje; label: string; value: number }[] {
  return FACTOR_KEYS.filter((k) => c.pond[k] > 0).map((k) => ({ key: k, label: FACTOR_LABEL[k], value: c.pond[k] }))
}

/** Puntajes que el usuario necesita registrar para simular la postulación. */
export function factoresRequeridos(c: Carrera): FactorPuntaje[] {
  return FACTOR_KEYS.filter((k) => c.pond[k] > 0)
}

/** Puntaje ponderado del usuario para una carrera (asume puntajes completos). */
export function puntajePonderado(c: Carrera, puntajes: PuntajesUsuario): number {
  let total = 0
  for (const k of FACTOR_KEYS) total += c.pond[k] * (puntajes[k] ?? 0)
  return total / 100
}

/** Puntaje PAES estimado a partir de respuestas correctas (escala 100–1000). */
export function puntajePaes(correctas: number, total: number): number {
  return Math.round(450 + (correctas / total) * 550)
}
