export type PaesSubject = 'lectora' | 'matematica' | 'historia' | 'ciencias'

export type ScoreFactor = PaesSubject | 'matematica2' | 'nem' | 'ranking'

export interface VocationalOption {
  label: string
  area: string
}

export interface VocationalQuestion {
  id: string
  text: string
  opts: VocationalOption[]
}

export interface PaesQuestion {
  t: string
  o: string[]
  c: number
}

export type ScienceMention = 'biologia' | 'fisica' | 'quimica'

export interface PaesMention {
  label: string
  icon: string
  qs: PaesQuestion[]
}

export interface PaesTest {
  label: string
  icon: string
  qs?: PaesQuestion[]
  menciones?: Record<ScienceMention, PaesMention>
}

export type UserScores = Record<ScoreFactor, number | null>

export type PaesAnswers = Record<number, number>
