import { createWebHistory, createRouter } from 'vue-router'

import GameView from './views/GameView.vue'
import HomeView from './views/HomeView.vue'
import LobbyView from './views/LobbyView.vue'
import SummaryView from './views/SummaryView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/lobby',
    name: 'lobby',
    component: LobbyView,
  },
  { path: '/play', name: 'play', component: GameView },
  { path: '/summary', name: 'summary', component: SummaryView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
