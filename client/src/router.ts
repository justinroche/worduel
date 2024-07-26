import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ViewOrganizer from './views/ViewOrganizer.vue'
import { useCurrentViewStore } from './stores/CurrentViewStore'
import { joinSession } from './clients/SessionClient'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'view',
    component: ViewOrganizer,
  },
  {
    path: '/join/:gameCode',
    name: 'join',
    component: ViewOrganizer,
    beforeEnter: async (to, from, next) => {
      const currentViewStore = useCurrentViewStore()
      currentViewStore.loading = true

      try {
        await joinSession((to.params.gameCode as string).toUpperCase())
      } catch (error) {
        // TODO: Handle error
      } finally {
        next({ name: 'view' })
        currentViewStore.loading = false
      }
    },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
