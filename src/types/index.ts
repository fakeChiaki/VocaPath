export type PaesSubject = 'lectora' | 'matematica' | 'historia' | 'ciencias'

export type ScoreFactor = PaesSubject | 'matematica2' | 'nem' | 'ranking'

export type ScienceMention = 'biologia' | 'fisica' | 'quimica'

export type UserScores = Record<ScoreFactor, number | null>
