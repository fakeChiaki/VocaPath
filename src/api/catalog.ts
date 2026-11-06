import type { ApiCareer, ApiUniversity } from '@/types/api'
import type { Carrera, Universidad } from '@/types'
import { AREA_LABEL } from '@/utils/carreras'

export function toCarrera(c: ApiCareer): Carrera {
  const w = c.weights
  return {
    id: c.id,
    nombre: c.name,
    uni: c.universityName,
    uniId: c.universityId,
    titulo: c.title,
    grado: c.degree,
    duracion: c.duration,
    codigo: c.externalCode,
    regimen: c.regimen,
    area: c.areaCode,
    areaLabel: (c.areaCode && AREA_LABEL[c.areaCode]) || c.areaLabel || 'Sin área',
    pond: {
      nem: w.nem,
      ranking: w.ranking,
      lectora: w.lectora,
      matematica: w.matematica,
      matematica2: w.matematica2,
      historia: w.historia,
      ciencias: w.ciencias,
    },
    historiaOCiencias: w.historiaOCiencias === true,
    vacantes: c.vacantes,
    primero: c.firstSelectedScore,
    ultimo: c.cutoffScore,
    perfil: c.profile,
    malla: c.curriculumUrl,
  }
}

export function toUniversidad(u: ApiUniversity): Universidad {
  return { id: u.id, name: u.name, full: u.fullName, city: u.city, color: u.color }
}
