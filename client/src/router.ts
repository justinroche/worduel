import { createWebHistory, createRouter } from 'vue-router'

import GameView from './views/GameView.vue'
import HomeView from './views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/play', component: GameView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
