import type { ScoreFactor } from '@/types'

export interface CareerWeights {
  nem: number
  ranking: number
  lectora: number
  matematica: number
  matematica2: number
  historia: number
  ciencias: number
  historiaOCiencias?: boolean
}

export interface Career {
  id: string
  name: string
  title: string | null
  degree: string | null
  duration: string | null
  regimen: string | null
  externalCode: string | null
  vacantes: number
  firstSelectedScore: number | null
  cutoffScore: number | null
  profile: string | null
  curriculumUrl: string | null
  weights: CareerWeights
  areaCode: string | null
  areaLabel: string | null
  universityId: string
  universityName: string
  universityFullName: string
  universityCity: string
  universityColor: string
}

export interface University {
  id: string
  name: string
  fullName: string
  city: string
  color: string
  websiteUrl: string
}

export interface PaesDate {
  id: string
  phase: string
  title: string
  dateStart: string | null
  dateEnd: string | null
  dateLabel: string
  status: 'Próximo' | 'Programado' | 'Finalizado'
  icon: string
}

export interface UserScore {
  factor: ScoreFactor
  value: number
  source: 'manual' | 'paes_attempt'
  attemptId: string | null
}

export interface PaesQuestionItem {
  id: string
  text: string
  options: string[]
}

export interface PaesReviewItem {
  questionId: string
  text: string
  options: string[]
  correctIndex: number
  selectedIndex: number
}

export interface PaesAttemptResult {
  attemptId: string
  score: number
  correctCount: number
  totalCount: number
  review: PaesReviewItem[]
}

export interface SimulationResult {
  career: { id: string; name: string; universityName: string; cutoffScore: number | null }
  status: 'missing_scores' | 'cutoff_unavailable' | 'success' | 'not_enough'
  missingFactors: ScoreFactor[]
  missingAnyOf: ['historia', 'ciencias'] | null
  weightedScore: number | null
}

export interface VocationalQuestionItem {
  id: string
  text: string
  options: { id: string; label: string }[]
}

export interface VocationalResult {
  attemptId: string
  affinity: Record<string, number>
  topAreas: string[]
  recommendedCareers: Career[]
}
