<script setup lang="ts">
import MenuButton from '../components/MenuButton.vue'
import { useSessionStore } from '../stores/SessionStore'
import { getTotalScore } from '../utils/gameUtils'
import { leaveRoom } from '../clients/SessionClient'
import { computed, ref } from 'vue'
import Scoreboard from '../components/Scoreboard.vue'
import LobbyGameOptionsSection from '../components/lobby/LobbyGameOptionsSection.vue'
import RoundSummary from '../components/RoundSummary.vue'
import router from '../router'

const sessionStore = useSessionStore()

const exitButtonLoading = ref(false)

const handleExitButton = async () => {
  exitButtonLoading.value = true
  await leaveRoom()
  await router.push({ name: 'home' })
  exitButtonLoading.value = false
}

const openRound = ref(-1)

const winningPlayerName = computed(() => {
  const player1Score = getTotalScore(1)
  const player2Score = getTotalScore(2)
  if (player1Score > player2Score) {
    return sessionStore.player1Name
  } else if (player2Score > player1Score) {
    return sessionStore.player2Name
  } else {
    return 'tie'
  }
})
</script>

<template>
  <h1>Game Summary</h1>
  <h2 v-if="winningPlayerName !== 'tie'">{{ winningPlayerName }} wins!</h2>
  <h2 v-else>It's a tie!</h2>
  <div class="summaryBody">
    <div class="leftContainer">
      <div class="scoreboard">
        <h2>Scoreboard</h2>
        <scoreboard />
      </div>
      <div class="gameOptions">
        <lobby-game-options-section :isLobby="false" />
      </div>
    </div>
    <div class="rightContainer">
      <div
        v-for="(round, index) in sessionStore.rounds"
        :key="index"
        class="roundSummary"
      >
        <round-summary
          :round="round"
          :roundIndex="index"
          :openRound="openRound"
          @update:openRound="openRound = $event"
        />
      </div>
    </div>
  </div>
  <div class="exit-session-section">
    <menu-button
      buttonText="Exit"
      fontSize="1rem"
      buttonWidth="250px"
      buttonHeight="40px"
      buttonStyle="atomic-tangerine"
      @click="handleExitButton"
      :loading="exitButtonLoading"
    />
  </div>
</template>

<style scoped>
.summaryBody {
  display: flex;
  justify-content: space-between;
  width: 1000px;
  transform: translateX(150px);
}

.gameOptions {
  margin-top: 60px;
}

.exit-session-section {
  position: absolute;
  bottom: 10vh;
  right: 0;
  left: 0;
}
</style>
