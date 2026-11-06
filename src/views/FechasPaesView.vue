<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, errorMessage } from '@/api/client'
import type { ApiPaesDate } from '@/types/api'

const fechas = ref<ApiPaesDate[]>([])
const cargando = ref(true)
const error = ref('')

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const { data } = await api.get<ApiPaesDate[]>('/paes-dates')
    fechas.value = data
  } catch (e) {
    error.value = errorMessage(e, 'No se pudieron cargar las fechas.')
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)

const ESTADO_STYLE: Record<ApiPaesDate['status'], string> = {
  Próximo: 'bg-[#e7f0ff] text-blue-600',
  Programado: 'bg-slate-100 text-slate-500',
  Finalizado: 'bg-emerald-50 text-emerald-700',
}
</script>

<template>
  <section class="animate-vp-fade">
    <div class="mb-7">
      <span class="text-[13px] font-semibold text-blue-600">CALENDARIO OFICIAL · DEMRE</span>
      <h1 class="mt-1.5 mb-2 font-display text-4xl font-bold tracking-tight">Fechas importantes de la PAES</h1>
      <p class="max-w-[620px] text-base text-slate-500">
        Estas fechas son provistas oficialmente por el DEMRE para el proceso de Admisión 2027. Mantente atento a las
        inscripciones y rendiciones.
      </p>
    </div>

    <p v-if="cargando" class="text-sm text-slate-500">Cargando fechas…</p>
    <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800" role="alert">
      {{ error }}
      <button class="ml-3 cursor-pointer border-none bg-transparent font-semibold text-rose-700 underline" @click="cargar">
        Reintentar
      </button>
    </div>
    <p v-else-if="fechas.length === 0" class="text-sm text-slate-500">Aún no hay fechas publicadas.</p>
    <div v-else class="rounded-[20px] border border-line bg-white px-7 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
      <div
        v-for="(d, i) in fechas"
        :key="d.id"
        class="flex items-center gap-5 py-5"
        :class="i < fechas.length - 1 ? 'border-b border-slate-100' : ''"
      >
        <span class="flex size-12.5 shrink-0 items-center justify-center rounded-[14px] bg-surface text-2xl">
          {{ d.icon }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2.5">
            <span class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{{ d.phase }}</span>
            <span class="rounded-full px-2.25 py-0.5 text-[11px] font-semibold" :class="ESTADO_STYLE[d.status]">
              {{ d.status }}
            </span>
          </div>
          <div class="font-display text-[17px] font-semibold">{{ d.title }}</div>
        </div>
        <div class="font-display text-base font-bold whitespace-nowrap text-blue-600">{{ d.dateLabel }}</div>
      </div>
    </div>
  </section>
</template>
