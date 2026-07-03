<script setup lang="ts">
defineProps<{ titulo: string; asignada: string }>()
</script>

<template>
  <section class="animate-vp-fade">
    <div class="rounded-[18px] border-2 border-dashed border-[#d6e0ee] bg-white px-6 py-16 text-center">
      <div class="mb-3 text-[42px]">🚧</div>
      <h1 class="mb-1.5 font-display text-lg font-bold">{{ titulo }}</h1>
      <p class="text-sm text-slate-500">Pantalla en construcción · asignada a {{ asignada }}.</p>
    </div>
  </section>
</template>
