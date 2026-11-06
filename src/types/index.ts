export type MateriaPaes = 'lectora' | 'matematica' | 'historia' | 'ciencias'

export type FactorPuntaje = MateriaPaes | 'matematica2' | 'nem' | 'ranking'

export interface Carrera {
  id: string
  nombre: string
  uni: string
  uniId: string
  titulo: string | null
  grado: string | null
  duracion: string | null
  codigo: string | null
  regimen: string | null
  area: string | null
  areaLabel: string
  pond: Record<FactorPuntaje, number>
  historiaOCiencias: boolean
  vacantes: number
  primero: number | null
  ultimo: number | null
  perfil: string | null
  malla: string | null
}

export interface Universidad {
  id: string
  name: string
  full: string
  city: string
  color: string
}

export interface OpcionVocacional {
  label: string
  area: string
}

export interface PreguntaVocacional {
  id: string
  text: string
  opts: OpcionVocacional[]
}

export interface PreguntaPaes {
  t: string
  o: string[]
  c: number
}

export type MencionCiencias = 'biologia' | 'fisica' | 'quimica'

export interface MencionPaes {
  label: string
  icon: string
  qs: PreguntaPaes[]
}

export interface PruebaPaes {
  label: string
  icon: string
  qs?: PreguntaPaes[]
  menciones?: Record<MencionCiencias, MencionPaes>
}

export type PuntajesUsuario = Record<FactorPuntaje, number | null>

export type RespuestasPaes = Record<number, number>
