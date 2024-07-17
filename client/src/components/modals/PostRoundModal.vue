<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import Scoreboard from '../Scoreboard.vue'
import MenuButton from '../MenuButton.vue'
import { nextRound, endGame } from '../../clients/SessionClient'
import ResultTables from '../ResultTables.vue'

const sessionStore = useSessionStore()

const currentRound = computed(() => sessionStore.getCurrentRound)
const numberOfRounds = computed(() => sessionStore.rounds)

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
  <div class="overlay">
    <div class="modal">
      <h2>Round {{ currentRound }} Complete</h2>
      <result-tables :round="currentRound" />
      <div class="scoreboard">
        <h3>Scoreboard</h3>
        <scoreboard />
      </div>
      <menu-button
        v-if="sessionStore.getPlayerIsHost && currentRound < numberOfRounds"
        buttonText="Next Round"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="atomic-tangerine"
        @click="handleNextRoundButton"
        :loading="nextRoundButtonLoading"
      />
      <menu-button
        v-else-if="sessionStore.getPlayerIsHost"
        buttonText="View Game Summary"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="atomic-tangerine"
        @click="handleViewGameSummaryButton"
        :loading="viewGameSummaryButtonLoading"
      />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal {
  width: 700px;
  height: 900px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scoreboard {
  height: 300px;
  margin-bottom: 1.25rem;
}

.scoreboard h3 {
  margin: 0 0 0.5rem 0;
}
</style>
