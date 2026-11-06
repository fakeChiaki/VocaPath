import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useFavoritesStore } from '@/stores/favorites'

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
    { path: '/registro', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guestOnly: true } },
    { path: '/fechas', name: 'paes-dates', component: () => import('@/views/PaesDatesView.vue') },
    { path: '/carreras', name: 'careers', component: () => import('@/views/CareersView.vue') },
    { path: '/carreras/:id', name: 'career-detail', component: () => import('@/views/CareerDetailView.vue') },
    { path: '/universidades', name: 'universities', component: () => import('@/views/UniversitiesView.vue') },
    {
      path: '/universidades/:id',
      name: 'university-detail',
      component: () => import('@/views/UniversityDetailView.vue'),
    },
    { path: '/comparar', name: 'compare', component: () => import('@/views/CompareView.vue') },
    { path: '/favoritas', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
    { path: '/test-vocacional', name: 'vocational-test', component: () => import('@/views/VocationalTestView.vue') },
    { path: '/prueba-paes', name: 'paes-test', component: () => import('@/views/PaesTestView.vue') },
    {
      path: '/prueba-paes/:subject',
      name: 'paes-test-subject',
      component: () => import('@/views/PaesTestSubjectView.vue'),
    },
    { path: '/puntajes', name: 'scores', component: () => import('@/views/ScoresView.vue') },
    { path: '/simulador', name: 'simulator', component: () => import('@/views/SimulatorView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (to.meta.guestOnly) return auth.isAuthenticated ? '/' : true
  if (to.meta.public) return true
  if (!auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  await Promise.all([useCatalogStore().load(), useFavoritesStore().load()])
  return true
})

export default router
