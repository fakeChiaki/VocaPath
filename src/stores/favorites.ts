import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loadJSON, saveJSON } from '@/utils/storage'

const STORAGE_KEY = 'vp_fav'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>(loadJSON<string[]>(STORAGE_KEY, []))

  const count = computed(() => ids.value.length)

  function has(id: string): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: string): void {
    ids.value = has(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id]
    saveJSON(STORAGE_KEY, ids.value)
  }

  return { ids, count, has, toggle }
})
