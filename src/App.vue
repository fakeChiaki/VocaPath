<script setup lang="ts">
import AppNavbar from '@/components/layout/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen">
    <AppNavbar />
    <main class="mx-auto max-w-[1240px] px-7 pt-10 pb-18">
      <RouterView />
    </main>
  </div>
</template>
