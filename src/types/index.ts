export type MateriaPaes = 'lectora' | 'matematica' | 'historia' | 'ciencias'

export type FactorPuntaje = MateriaPaes | 'nem' | 'ranking'

export interface Carrera {
  id: string
  nombre: string
  uni: string
  titulo: string
  grado: string
  duracion: string
  codigo: string
  regimen: string
  area: string
  pond: Record<FactorPuntaje, number>
  vacantes: number
  primero: number
  ultimo: number
  perfil: string
}

export interface Universidad {
  name: string
  full: string
  city: string
  color: string
}

export interface FechaPaes {
  fase: string
  titulo: string
  fecha: string
  estado: 'Próximo' | 'Programado' | 'Finalizado'
  icon: string
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
