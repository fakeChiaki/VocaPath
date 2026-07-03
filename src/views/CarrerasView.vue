<script setup lang="ts">
import CareerSearchBar from '@/components/careers/CareerSearchBar.vue'
import CareerCard from '@/components/careers/CareerCard.vue'
import { useCareerFilter } from '@/composables/useCareerFilter'

const { search, filtradas } = useCareerFilter()
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-6">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Carreras disponibles</h1>
      <p class="text-base text-slate-500">Busca por nombre y revisa la malla, puntajes y perfil de cada carrera.</p>
    </div>

    <CareerSearchBar v-model="search" class="mb-2" />
    <div class="mb-4.5 text-[13px] text-slate-400">{{ filtradas.length }} carreras encontradas</div>

    <div class="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <CareerCard v-for="c in filtradas" :key="c.id" :carrera="c" />
    </div>
  </section>
</template>
