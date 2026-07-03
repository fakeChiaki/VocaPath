import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCompareStore = defineStore('compare', () => {
  const ids = ref<string[]>([])

  const count = computed(() => ids.value.length)
  const hasTwo = computed(() => ids.value.length === 2)

  function has(id: string): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: string): void {
    if (has(id)) ids.value = ids.value.filter((x) => x !== id)
    else if (ids.value.length >= 2) ids.value = [ids.value[1]!, id]
    else ids.value = [...ids.value, id]
  }

  function clear(): void {
    ids.value = []
  }

  return { ids, count, hasTwo, has, toggle, clear }
})
