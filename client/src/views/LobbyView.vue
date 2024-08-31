<script setup lang="ts">
import { ref, watch } from 'vue'
import LobbyPlayersSection from '../components/lobby/LobbyPlayersSection.vue'
import LobbyGameOptionsSection from '../components/lobby/LobbyGameOptionsSection.vue'
import HeaderBanner from '../components/HeaderBanner.vue'
import MenuButton from '../components/MenuButton.vue'
import { useSessionStore } from '../stores/SessionStore'
import { useCurrentViewStore } from '../stores/CurrentViewStore'
import {
  startGameCountdown,
  startGame,
  exitSession,
} from '../clients/SessionClient'

const sessionStore = useSessionStore()
const currentViewStore = useCurrentViewStore()

const startGameButtonLoading = ref(false)
const startGameButtonCounting = ref(false)
const startGameButtonText = ref('Start Game')
const exitGameButtonLoading = ref(false)
const tooltipText = ref('Copy link')
const player2Countdown = ref(-1)

const handleStartGameButtonClicked = async () => {
  await startGameCountdown()
  startGameButtonCounting.value = true
  for (let i = 3; i > 0; i--) {
    startGameButtonText.value = i.toString() + '...'
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  startGameButtonCounting.value = false
  startGameButtonLoading.value = true
  startGameButtonText.value = 'Start Game'

  try {
    await startGame()
  } catch (error) {
    console.error('Error starting game:', error)
    // TODO: Show error message
  } finally {
    startGameButtonLoading.value = false
  }
}

const player2StartGameCountdown = async () => {
  for (let i = 3; i > 0; i--) {
    player2Countdown.value = i
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  player2Countdown.value = 0
}

watch(
  () => sessionStore.player2CountingDown,
  (newValue) => {
    if (newValue === true) {
      player2StartGameCountdown()
    }
  }
)

const handleExitLobbyButtonClicked = async () => {
  exitGameButtonLoading.value = true
  try {
    await exitSession(sessionStore.playerIsHost ? 1 : 2)
    currentViewStore.setCurrentView('home')
  } catch (error) {
    console.error('Error exiting session:', error)
    // TODO: Show error message
  } finally {
    exitGameButtonLoading.value = false
  }
}

const copyJoinLink = () => {
  const url = `${window.location.origin}/join/${sessionStore.session.sessionCode}`
  navigator.clipboard.writeText(url).then(() => {
    tooltipText.value = 'Copied!'
    setTimeout(() => {
      tooltipText.value = 'Copy link'
    }, 2000) // Reset after 2 seconds
  })
}
</script>

<template>
  <div class="lobby-view">
    <header-banner title="Game Setup" />
    <div class="top-row">
      <div class="lobby-section">
        <h2 class="game-code-header">Game Code</h2>
        <p class="session-code">{{ sessionStore.session.sessionCode }}</p>
        <button class="link-button" @click="copyJoinLink">
          <p class="session-link">
            playworduel.com/join/{{ sessionStore.session.sessionCode }}
          </p>
          <div class="tooltip">{{ tooltipText }}</div>
        </button>
      </div>
      <div class="players-section">
        <lobby-players-section />
      </div>
    </div>
    <div class="bottom-row">
      <div class="game-options-section">
        <lobby-game-options-section :isLobby="true" />
      </div>
      <div class="host-buttons-section">
        <menu-button
          v-if="sessionStore.playerIsHost"
          :buttonText="startGameButtonText"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="primary"
          class="start-button"
          @click="handleStartGameButtonClicked"
          :disabled="
            !sessionStore.session.player2Connected || startGameButtonCounting
          "
          :loading="startGameButtonLoading"
        />
        <div v-else>
          <p v-if="player2Countdown === -1">
            Waiting for host to start the game...
          </p>
          <p v-else-if="player2Countdown === 0">Game starting...</p>
          <p v-else>Game starting in {{ player2Countdown }} seconds...</p>
        </div>
        <menu-button
          buttonText="Exit Lobby"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="secondary"
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

.game-code-header {
  margin-bottom: 0;
}

.session-code {
  font-size: 4rem;
  margin: 0;
  line-height: 8rem;
  font-weight: 600;
}

.session-link {
  margin: 0;
}

.host-buttons-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 62px;
  box-sizing: border-box;
}

.start-button {
  margin-bottom: 20px;
}

.link-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  font-family: inherit;
  font-size: 1rem;
  color: black;
  position: relative;
}

.link-button:hover {
  color: #414d40;
}

.tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 0.25rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  position: absolute;
  top: 1.5rem;
  z-index: 1;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
}

.link-button:hover .tooltip {
  visibility: visible;
}
</style>
