import { createWebHistory, createRouter, RouteRecordRaw, RouteLocation } from 'vue-router'

import GameView from './views/GameView.vue'
import HomeView from './views/HomeView.vue'
import LobbyView from './views/LobbyView.vue'
import SummaryView from './views/SummaryView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/lobby/:gameCode',
    name: 'lobby',
    component: LobbyView,
  },
  { path: '/play/:gameCode', name: 'play', component: GameView },
  { path: '/summary/:gameCode', name: 'summary', component: SummaryView },
  { 
    path: '/join/:gameCode', 
    redirect: (to: RouteLocation) => {
      const { gameCode } = to.params as { gameCode: string }
      return { name: 'lobby', params: { gameCode } }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

