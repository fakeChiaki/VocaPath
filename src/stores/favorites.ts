import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api, errorMessage } from '@/api/client'
import type { Career } from '@/types/api'

const LEGACY_KEY = 'vp_fav'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])
  const loaded = ref(false)
  const error = ref('')

  const count = computed(() => ids.value.length)

  async function load() {
    if (loaded.value) return
    try {
      const { data } = await api.get<Career[]>('/favorites')
      ids.value = data.map((c) => c.id)
      loaded.value = true
      localStorage.removeItem(LEGACY_KEY)
    } catch (e) {
      error.value = errorMessage(e, 'No se pudieron cargar tus favoritas.')
    }
  }

  function has(id: string): boolean {
    return ids.value.includes(id)
  }

  async function toggle(id: string) {
    const previous = ids.value
    const wasFavorite = has(id)
    ids.value = wasFavorite ? previous.filter((x) => x !== id) : [...previous, id]
    try {
      if (wasFavorite) await api.delete(`/favorites/${id}`)
      else await api.post(`/favorites/${id}`)
    } catch (e) {
      ids.value = previous
      error.value = errorMessage(e, 'No se pudo actualizar tus favoritas.')
    }
  }

  function reset() {
    ids.value = []
    loaded.value = false
    error.value = ''
  }

  return { ids, loaded, error, count, load, has, toggle, reset }
})
