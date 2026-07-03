<script setup lang="ts">
import { CARRERAS, MATERIAS_PAES, UNIVERSIDADES } from '@/utils/carreras'
import { useFavoritesStore } from '@/stores/favorites'

const favorites = useFavoritesStore()

const features = [
  {
    icon: '🧭',
    title: 'Test Vocacional',
    desc: 'Descubre qué carreras encajan con tus gustos y fortalezas.',
    tint: '#e7f0ff',
    to: '/test-vocacional',
  },
  {
    icon: '✏️',
    title: 'Prueba tipo PAES',
    desc: 'Practica con preguntas reales por materia y revisa tus respuestas.',
    tint: '#e0f2fe',
    to: '/prueba-paes',
  },
  {
    icon: '🎓',
    title: 'Carreras y Mallas',
    desc: 'Explora puntajes, ponderaciones y perfiles de cada carrera.',
    tint: '#ede9fe',
    to: '/carreras',
  },
  {
    icon: '⚖️',
    title: 'Comparar Carreras',
    desc: 'Pon dos carreras lado a lado y decide con datos.',
    tint: '#fef3c7',
    to: '/comparar',
  },
  {
    icon: '📊',
    title: 'Mis Puntajes',
    desc: 'Guarda y administra tus puntajes por materia.',
    tint: '#dcfce7',
    to: '/puntajes',
  },
  {
    icon: '🚀',
    title: 'Simulador de Postulación',
    desc: 'Calcula si alcanzas el puntaje de corte de tu carrera.',
    tint: '#ffe4e6',
    to: '/simulador',
  },
]
</script>

<template>
  <section class="animate-vp-fade">
    <div class="grid grid-cols-1 items-center gap-12 py-6 pb-14 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full bg-[#e7f0ff] px-3.5 py-1.75 text-[13px] font-semibold text-blue-600">
          🎓 Orientación vocacional · 3° y 4° medio
        </span>
        <h1 class="mt-5 font-display text-[54px] leading-[1.05] font-extrabold tracking-tight">
          Elige tu carrera<br />
          con
          <span class="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">claridad</span>,
          no con dudas.
        </h1>
        <p class="mt-5.5 mb-8 max-w-[480px] text-lg leading-relaxed text-slate-600">
          VocaPath te ayuda a descubrir qué estudiar: explora carreras, compara puntajes, haz tu test vocacional y
          simula tu postulación a la PAES. Todo en un solo lugar.
        </p>
        <div class="flex flex-wrap gap-3.5">
          <RouterLink
            to="/test-vocacional"
            class="rounded-[14px] bg-gradient-to-br from-blue-600 to-sky-500 px-7 py-3.75 font-display text-base font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.32)]"
          >
            Hacer test vocacional →
          </RouterLink>
          <RouterLink
            to="/carreras"
            class="rounded-[14px] border-[1.5px] border-[#cdd9ea] bg-white px-7 py-3.75 font-display text-base font-semibold text-slate-800"
          >
            Explorar carreras
          </RouterLink>
        </div>
        <div class="mt-10 flex gap-8">
          <div>
            <div class="font-display text-[26px] font-bold text-blue-600">{{ CARRERAS.length }}+</div>
            <div class="text-[13px] text-slate-500">carreras</div>
          </div>
          <div>
            <div class="font-display text-[26px] font-bold text-blue-600">{{ UNIVERSIDADES.length }}</div>
            <div class="text-[13px] text-slate-500">universidades</div>
          </div>
          <div>
            <div class="font-display text-[26px] font-bold text-blue-600">{{ MATERIAS_PAES.length }}</div>
            <div class="text-[13px] text-slate-500">pruebas PAES</div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="rounded-3xl border border-line bg-white p-6 shadow-[0_24px_48px_rgba(15,23,42,0.10)]">
          <div class="mb-4 flex items-center justify-between">
            <span class="font-display text-base font-bold">Medicina · UFRO</span>
            <span class="text-lg text-rose-600">♥</span>
          </div>
          <div class="mb-1.5 h-2 overflow-hidden rounded-full bg-[#eef2f7]">
            <div class="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-600 to-sky-500"></div>
          </div>
          <div class="mb-4.5 flex justify-between text-xs text-slate-500">
            <span>Tu puntaje 882</span>
            <span>Corte 882.3</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <div class="rounded-xl bg-surface p-3">
              <div class="text-[11px] text-slate-500">Comp. Matemática</div>
              <div class="font-display text-lg font-bold">912</div>
            </div>
            <div class="rounded-xl bg-surface p-3">
              <div class="text-[11px] text-slate-500">Ciencias</div>
              <div class="font-display text-lg font-bold">868</div>
            </div>
            <div class="rounded-xl bg-surface p-3">
              <div class="text-[11px] text-slate-500">Comp. Lectora</div>
              <div class="font-display text-lg font-bold">845</div>
            </div>
            <div class="rounded-xl bg-emerald-50 p-3">
              <div class="text-[11px] text-emerald-600">Simulación</div>
              <div class="font-display text-lg font-bold text-emerald-600">Quedas ✓</div>
            </div>
          </div>
        </div>
        <div
          class="absolute -bottom-5.5 -left-6 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
        >
          <span class="flex size-8.5 items-center justify-center rounded-[10px] bg-[#fff1f3] text-rose-600">♥</span>
          <div>
            <div class="text-[13px] font-bold">{{ favorites.count }} favoritas</div>
            <div class="text-[11px] text-slate-500">guardadas</div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-4.5 font-display text-2xl font-bold tracking-tight">Todo lo que necesitas para postular</h2>
    <div class="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="f in features"
        :key="f.title"
        :to="f.to"
        class="rounded-[18px] border border-line bg-white p-5.5 text-left transition-all duration-150 hover:-translate-y-0.75 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/10"
      >
        <span
          class="flex size-11.5 items-center justify-center rounded-[13px] text-[22px]"
          :style="{ background: f.tint }"
        >
          {{ f.icon }}
        </span>
        <div class="mt-3.5 mb-1.5 font-display text-[16.5px] font-bold">{{ f.title }}</div>
        <div class="text-sm leading-relaxed text-slate-500">{{ f.desc }}</div>
      </RouterLink>
    </div>

    <div class="mt-5.5 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-[13.5px] text-orange-900">
      <span class="text-lg">⚠️</span>
      <span>
        Tus favoritas y puntajes se guardan en <strong>el caché de tu navegador</strong>. Si lo limpias o usas modo
        incógnito, podrías perderlos.
      </span>
    </div>
  </section>
</template>