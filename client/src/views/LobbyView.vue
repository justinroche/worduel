<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '../router'
import LobbyPlayersSection from '../components/lobby/LobbyPlayersSection.vue'
import LobbyGameOptionsSection from '../components/lobby/LobbyGameOptionsSection.vue'
import MenuButton from '../components/MenuButton.vue'
import { useSessionStore } from '../stores/SessionStore'
import { startGame, exitSession } from '../clients/SessionClient'

const sessionStore = useSessionStore()
const sessionCode = computed(() => sessionStore.sessionCode)
const playerIsHost = computed(() => sessionStore.playerIsHost)
const player2Connected = computed(() => sessionStore.player2Connected)
const startGameButtonLoading = ref(false)
const exitGameButtonLoading = ref(false)

const handleStartGameButtonClicked = async () => {
  startGameButtonLoading.value = true
  try {
    await startGame()
  } catch (error) {
    console.error('Error starting game:', error)
    // TODO: Show error message
  } finally {
    startGameButtonLoading.value = false
  }
}

const handleExitLobbyButtonClicked = async () => {
  exitGameButtonLoading.value = true
  try {
    await exitSession(playerIsHost.value ? 1 : 2)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error exiting session:', error)
    // TODO: Show error message
  } finally {
    exitGameButtonLoading.value = false
  }
}
</script>

<template>
  <div class="lobby-view">
    <div class="top-row">
      <div class="lobby-section">
        <h2>Lobby Code</h2>
        <p class="session-code">{{ sessionCode }}</p>
      </div>
      <div class="players-section">
        <lobby-players-section />
      </div>
    </div>
    <div class="bottom-row">
      <div class="game-options-section">
        <lobby-game-options-section />
      </div>
      <div class="host-buttons-section">
        <menu-button
          v-if="playerIsHost"
          buttonText="Start Game"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="atomic-tangerine"
          class="start-button"
          @click="handleStartGameButtonClicked"
          :disabled="!player2Connected"
          :loading="startGameButtonLoading"
        />
        <div v-else>
          <p>Waiting for host to start the game...</p>
        </div>
        <menu-button
          buttonText="Exit Lobby"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="taupe"
          @click="handleExitLobbyButtonClicked"
          :loading="exitGameButtonLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.lobby-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 10vh;
  box-sizing: border-box;
  gap: 50px;
}

.top-row,
.bottom-row {
  display: flex;
  align-items: center;
  gap: 150px;
}

.players-section,
.lobby-section,
.host-buttons-section,
.game-options-section {
  width: 250px;
  height: 250px;
}

.session-code {
  font-size: 4rem;
  margin: 0;
  line-height: 8rem;
  font-weight: 600;
}

.host-buttons-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 25px;
  box-sizing: border-box;
}

.start-button {
  margin-bottom: 20px;
}
</style>
