<script setup lang="ts">
defineProps<{ mensaje?: string }>()
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-[13.5px] text-orange-900"
  >
    <span class="text-lg">⚠️</span>
    <span v-if="mensaje">{{ mensaje }}</span>
    <span v-else>
      Tus favoritas y puntajes se guardan en <strong>el caché de tu navegador</strong>. Si lo limpias o usas modo
      incógnito, podrías perderlos.
    </span>
  </div>
</template>
