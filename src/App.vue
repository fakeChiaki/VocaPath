<script setup lang="ts">
import AppNavbar from '@/components/layout/AppNavbar.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useFavoritesStore } from '@/stores/favorites'
import { useScoresStore } from '@/stores/scores'

const catalog = useCatalogStore()
const favorites = useFavoritesStore()
const scores = useScoresStore()
</script>

<template>
  <div class="min-h-screen">
    <AppNavbar />
    <main class="mx-auto max-w-[1240px] px-7 pt-10 pb-18">
      <div
        v-if="catalog.error"
        class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800"
        role="alert"
      >
        <span>{{ catalog.error }}</span>
        <button
          class="cursor-pointer rounded-[10px] border-none bg-rose-600 px-3.5 py-2 text-[13px] font-semibold text-white"
          @click="catalog.load()"
        >
          Reintentar
        </button>
      </div>
      <div
        v-if="favorites.error"
        class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800"
        role="alert"
      >
        <span>{{ favorites.error }}</span>
        <button
          class="cursor-pointer rounded-[10px] border-none bg-rose-600 px-3.5 py-2 text-[13px] font-semibold text-white"
          @click="favorites.error = ''"
        >
          Cerrar
        </button>
      </div>
      <div
        v-if="scores.error"
        class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800"
        role="alert"
      >
        <span>{{ scores.error }}</span>
        <button
          class="cursor-pointer rounded-[10px] border-none bg-rose-600 px-3.5 py-2 text-[13px] font-semibold text-white"
          @click="scores.error = ''"
        >
          Cerrar
        </button>
      </div>
      <RouterView />
    </main>
  </div>
</template>
