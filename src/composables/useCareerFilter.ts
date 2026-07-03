import { computed, ref, type Ref } from 'vue'
import type { Carrera } from '@/types'
import { CARRERAS } from '@/utils/carreras'

/** Búsqueda de carreras por nombre, reutilizada en Carreras, Universidad detalle y Comparar. */
export function useCareerFilter(lista?: Ref<Carrera[]>) {
  const search = ref('')

  const filtradas = computed(() => {
    const q = search.value.trim().toLowerCase()
    const base = lista?.value ?? CARRERAS
    return q ? base.filter((c) => c.nombre.toLowerCase().includes(q)) : base
  })

  return { search, filtradas }
}
