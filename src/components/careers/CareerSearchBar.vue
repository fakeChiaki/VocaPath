<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps<{ placeholder?: string }>()
</script>

<template>
  <div class="flex max-w-[520px] items-center gap-3 rounded-[14px] border-[1.5px] border-line bg-white py-1 pr-1 pl-4.5">
    <span class="text-lg text-slate-400">🔍</span>
    <input
      v-model="model"
      type="text"
      :placeholder="placeholder ?? 'Buscar carrera por nombre…'"
      class="flex-1 border-none bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-slate-400"
    />
  </div>
</template>
