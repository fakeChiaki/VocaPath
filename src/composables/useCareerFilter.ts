import { computed, ref, type Ref } from 'vue'
import type { Career } from '@/types/api'
import { useCatalogStore } from '@/stores/catalog'

/** Búsqueda de carreras por nombre, reutilizada en Carreras, Universidad detalle y Comparar. */
export function useCareerFilter(list?: Ref<Career[]>) {
  const catalog = useCatalogStore()
  const search = ref('')

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    const base = list?.value ?? catalog.careers
    return q ? base.filter((c) => c.name.toLowerCase().includes(q)) : base
  })

  return { search, filtered }
}
