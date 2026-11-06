import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { public: true } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
    { path: '/registro', name: 'registro', component: () => import('@/views/RegisterView.vue'), meta: { guestOnly: true } },
    { path: '/fechas', name: 'fechas', component: () => import('@/views/FechasPaesView.vue') },
    { path: '/carreras', name: 'carreras', component: () => import('@/views/CarrerasView.vue') },
    { path: '/carreras/:id', name: 'carrera-detalle', component: () => import('@/views/CarreraDetalleView.vue') },
    { path: '/universidades', name: 'universidades', component: () => import('@/views/UniversidadesView.vue') },
    {
      path: '/universidades/:nombre',
      name: 'universidad-detalle',
      component: () => import('@/views/UniversidadDetalleView.vue'),
    },
    { path: '/comparar', name: 'comparar', component: () => import('@/views/CompararView.vue') },
    { path: '/favoritas', name: 'favoritas', component: () => import('@/views/FavoritasView.vue') },
    { path: '/test-vocacional', name: 'test-vocacional', component: () => import('@/views/TestVocacionalView.vue') },
    { path: '/prueba-paes', name: 'prueba-paes', component: () => import('@/views/PruebaPaesView.vue') },
    {
      path: '/prueba-paes/:materia',
      name: 'prueba-paes-materia',
      component: () => import('@/views/PruebaPaesMateriaView.vue'),
    },
    { path: '/puntajes', name: 'puntajes', component: () => import('@/views/PuntajesView.vue') },
    { path: '/simulador', name: 'simulador', component: () => import('@/views/SimuladorView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (to.meta.guestOnly) return auth.isAuthenticated ? '/' : true
  if (to.meta.public || auth.isAuthenticated) return true
  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
