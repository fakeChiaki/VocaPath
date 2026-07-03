<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Carrera } from '@/types'
import CareerCard from '@/components/careers/CareerCard.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { getCarrera } from '@/utils/carreras'

const router = useRouter()
const favorites = useFavoritesStore()

const favCareers = computed<Carrera[]>(() =>
  favorites.ids.map((id) => getCarrera(id)).filter((c): c is Carrera => !!c),
)
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-6">
      <h1 class="mb-2 font-display text-4xl font-bold tracking-tight">♥ Mis carreras favoritas</h1>
      <p class="text-base text-slate-500">Tus carreras guardadas. Se almacenan en el caché de tu navegador.</p>
    </div>

    <div
      v-if="favCareers.length === 0"
      class="rounded-[18px] border-2 border-dashed border-[#f3cdd6] bg-white px-6 py-16 text-center"
    >
      <div class="mb-3 text-[42px]">💙</div>
      <div class="mb-1.5 font-display text-lg font-bold">Aún no tienes favoritas</div>
      <div class="mb-4.5 text-sm text-slate-500">Marca el ♥ en cualquier carrera para guardarla aquí.</div>
      <button
        class="cursor-pointer rounded-[13px] border-none bg-gradient-to-br from-blue-600 to-sky-500 px-6 py-3 font-display text-[15px] font-semibold text-white"
        @click="router.push('/carreras')"
      >
        Explorar carreras
      </button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <CareerCard v-for="c in favCareers" :key="c.id" :carrera="c" />
    </div>
  </section>
</template>
