<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CARRERAS, UNIVERSIDADES } from '@/utils/carreras'

const router = useRouter()

const universidades = UNIVERSIDADES.map((u) => ({
  ...u,
  count: CARRERAS.filter((c) => c.uni === u.name).length,
}))

function abrir(nombre: string) {
  router.push(`/universidades/${nombre}`)
}
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-6">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">Universidades</h1>
      <p class="text-base text-slate-500">Selecciona una universidad para ver sólo sus carreras.</p>
    </div>

    <div class="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="u in universidades"
        :key="u.name"
        class="cursor-pointer rounded-[20px] border border-line bg-white p-6.5 transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
        @click="abrir(u.name)"
      >
        <span
          class="flex size-14.5 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-white"
          :style="{ background: u.color }"
        >
          {{ u.name }}
        </span>
        <div class="mt-4.5 mb-1 font-display text-xl font-bold">{{ u.full }}</div>
        <div class="mb-4.5 text-[13.5px] text-slate-500">📍 {{ u.city }}</div>
        <div
          class="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3.5 py-1.75 text-[13px] font-semibold text-blue-600"
        >
          {{ u.count }} carreras disponibles →
        </div>
      </div>
    </div>
  </section>
</template>
