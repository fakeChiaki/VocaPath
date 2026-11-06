export interface ApiCareerWeights {
  nem: number
  ranking: number
  lectora: number
  matematica: number
  matematica2: number
  historia: number
  ciencias: number
  historiaOCiencias?: boolean
}

export interface ApiCareer {
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
  weights: ApiCareerWeights
  areaCode: string | null
  areaLabel: string | null
  universityId: string
  universityName: string
  universityFullName: string
  universityCity: string
  universityColor: string
}

export interface ApiUniversity {
  id: string
  name: string
  fullName: string
  city: string
  color: string
  websiteUrl: string
}

export interface ApiPaesDate {
  id: string
  phase: string
  title: string
  dateStart: string | null
  dateEnd: string | null
  dateLabel: string
  status: 'Próximo' | 'Programado' | 'Finalizado'
  icon: string
}
