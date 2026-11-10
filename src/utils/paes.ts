import type { PaesSubject, ScienceMention } from '@/types'

export const PAES_SUBJECTS: PaesSubject[] = ['lectora', 'matematica', 'historia', 'ciencias']

export const SUBJECT_META: Record<PaesSubject, { label: string; icon: string }> = {
  lectora: { label: 'Comp. Lectora', icon: '📖' },
  matematica: { label: 'Comp. Matemática 1', icon: '📐' },
  historia: { label: 'Historia y Cs. Sociales', icon: '🏛️' },
  ciencias: { label: 'Ciencias', icon: '🔬' },
}

export const MENTION_META: Record<ScienceMention, { label: string; icon: string }> = {
  biologia: { label: 'Biología', icon: '🧬' },
  fisica: { label: 'Física', icon: '⚛️' },
  quimica: { label: 'Química', icon: '⚗️' },
}

export function isPaesSubject(value: unknown): value is PaesSubject {
  return typeof value === 'string' && (PAES_SUBJECTS as string[]).includes(value)
}

export function isScienceMention(value: unknown): value is ScienceMention {
  return typeof value === 'string' && value in MENTION_META
}
