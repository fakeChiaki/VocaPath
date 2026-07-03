<script setup lang="ts">
import type { FechaPaes } from '@/types'
import fechasData from '@/data/fechas-paes.json'

const fechas = fechasData as FechaPaes[]

const ESTADO_STYLE: Record<FechaPaes['estado'], string> = {
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

    <div class="rounded-[20px] border border-line bg-white px-7 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
      <div
        v-for="(d, i) in fechas"
        :key="d.titulo"
        class="flex items-center gap-5 py-5"
        :class="i < fechas.length - 1 ? 'border-b border-slate-100' : ''"
      >
        <span class="flex size-12.5 shrink-0 items-center justify-center rounded-[14px] bg-surface text-2xl">
          {{ d.icon }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2.5">
            <span class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{{ d.fase }}</span>
            <span class="rounded-full px-2.25 py-0.5 text-[11px] font-semibold" :class="ESTADO_STYLE[d.estado]">
              {{ d.estado }}
            </span>
          </div>
          <div class="font-display text-[17px] font-semibold">{{ d.titulo }}</div>
        </div>
        <div class="font-display text-base font-bold whitespace-nowrap text-blue-600">{{ d.fecha }}</div>
      </div>
    </div>
  </section>
</template>
