<script setup lang="ts">
import GameView from './GameView.vue'
import HomeView from './HomeView.vue'
import LobbyView from './LobbyView.vue'
import PageLoadingView from './PageLoadingView.vue'
import SummaryView from './SummaryView.vue'
import { useCurrentViewStore } from '../stores/CurrentViewStore'

const currentViewStore = useCurrentViewStore()
</script>

<template>
  <PageLoadingView v-if="currentViewStore.loading" />
  <HomeView v-else-if="currentViewStore.currentView === 'home'" />
  <LobbyView v-else-if="currentViewStore.currentView === 'lobby'" />
  <GameView v-else-if="currentViewStore.currentView === 'game'" />
  <SummaryView v-else-if="currentViewStore.currentView === 'summary'" />
</template>
