import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, errorMessage } from '@/api/client'
import type { Career, University } from '@/types/api'

export const useCatalogStore = defineStore('catalog', () => {
  const careers = ref<Career[]>([])
  const universities = ref<University[]>([])
  const loaded = ref(false)
  const error = ref('')
  let loading: Promise<void> | null = null

  function load() {
    if (loaded.value) return Promise.resolve()
    loading ??= (async () => {
      try {
        const [c, u] = await Promise.all([api.get<Career[]>('/careers'), api.get<University[]>('/universities')])
        careers.value = c.data.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        universities.value = u.data.sort((a, b) => a.name.localeCompare(b.name, 'es'))
        loaded.value = true
        error.value = ''
      } catch (e) {
        error.value = errorMessage(e, 'No se pudo cargar el catálogo de carreras.')
      } finally {
        loading = null
      }
    })()
    return loading
  }

  function getCareer(id: string | null | undefined) {
    return careers.value.find((c) => c.id === id)
  }

  function getUniversity(id: string | null | undefined) {
    return universities.value.find((u) => u.id === id)
  }

  function universityColor(name: string) {
    return universities.value.find((u) => u.name === name)?.color ?? '#2563eb'
  }

  return { careers, universities, loaded, error, load, getCareer, getUniversity, universityColor }
})
