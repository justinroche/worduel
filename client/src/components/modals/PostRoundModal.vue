<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import Modal from './Modal.vue'
import Scoreboard from '../Scoreboard.vue'
import MenuButton from '../MenuButton.vue'
import { nextRound, endGame } from '../../clients/SessionClient'
import ResultTables from '../ResultTables.vue'

const sessionStore = useSessionStore()

const currentRound = computed(() => sessionStore.session.currentRound)
const numberOfRounds = computed(() => sessionStore.session.rounds)

const nextRoundButtonLoading = ref(false)
const viewGameSummaryButtonLoading = ref(false)

const handleNextRoundButton = async () => {
  nextRoundButtonLoading.value = true
  await nextRound()
  nextRoundButtonLoading.value = false
}

const handleViewGameSummaryButton = async () => {
  viewGameSummaryButtonLoading.value = true
  await endGame()
  viewGameSummaryButtonLoading.value = false
}
</script>

<template>
  <modal width="700px" height="900px">
    <h2 class="header">Round {{ currentRound }} Complete</h2>
    <result-tables :round="currentRound" />
    <div class="scoreboard">
      <h3>Scoreboard</h3>
      <scoreboard />
    </div>
    <menu-button
      v-if="sessionStore.playerIsHost && currentRound < numberOfRounds"
      buttonText="Next Round"
      fontSize="1rem"
      buttonWidth="250px"
      buttonHeight="40px"
      buttonStyle="primary"
      @click="handleNextRoundButton"
      :loading="nextRoundButtonLoading"
    />
    <menu-button
      v-else-if="sessionStore.playerIsHost"
      buttonText="View Game Summary"
      fontSize="1rem"
      buttonWidth="250px"
      buttonHeight="40px"
      buttonStyle="primary"
      @click="handleViewGameSummaryButton"
      :loading="viewGameSummaryButtonLoading"
    />
    <p v-else>Waiting for host to continue...</p>
  </modal>
</template>

<style scoped>
.header {
  margin-top: 0;
}

.scoreboard {
  height: 300px;
  margin-bottom: 1.25rem;
}

.scoreboard h3 {
  margin: 0 0 0.5rem 0;
}
</style>
