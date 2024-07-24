<script setup lang="ts">
import MenuButton from '../components/MenuButton.vue'
import { useSessionStore } from '../stores/SessionStore'
import { getTotalScore } from '../utils/gameUtils'
import { leaveRoom } from '../clients/SessionClient'
import { computed, ref } from 'vue'
import Scoreboard from '../components/Scoreboard.vue'
import LobbyGameOptionsSection from '../components/lobby/LobbyGameOptionsSection.vue'
import RoundSummary from '../components/RoundSummary.vue'
import HeaderBanner from '../components/HeaderBanner.vue'
import router from '../router'

const sessionStore = useSessionStore()

const exitButtonLoading = ref(false)

const handleExitButton = async () => {
  exitButtonLoading.value = true
  await leaveRoom()
  router.push({ name: 'home' })
  exitButtonLoading.value = false
}

const openRound = ref(-1)

const winningPlayerName = computed(() => {
  const player1Score = getTotalScore(1)
  const player2Score = getTotalScore(2)
  if (player1Score > player2Score) {
    return sessionStore.session.player1Name
  } else if (player2Score > player1Score) {
    return sessionStore.session.player2Name
  } else {
    return 'tie'
  }
})
</script>

<template>
  <header-banner title="Game Summary" />
  <div class="pageBody">
    <h1 v-if="winningPlayerName !== 'tie'">{{ winningPlayerName }} wins!</h1>
    <h1 v-else>It's a tie!</h1>
    <div class="summaryBody">
      <div class="leftContainer">
        <div class="leftBody">
          <div class="scoreboard">
            <h2 class="scoreboard-title">Scoreboard</h2>
            <scoreboard />
          </div>
          <div class="gameOptions">
            <lobby-game-options-section :isLobby="false" />
          </div>
        </div>
      </div>
      <div class="rightContainer">
        <div
          v-for="(round, index) in sessionStore.getRounds"
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
        buttonStyle="primary"
        @click="handleExitButton"
        :loading="exitButtonLoading"
      />
    </div>
  </div>
</template>

<style scoped>
.pageBody {
  margin-top: 60px;
}

.summaryBody {
  display: flex;
  justify-content: space-between;
  width: 1050px;
  margin-top: 50px;
}

.leftBody {
  padding: 1rem;
  border-radius: 0.25rem;
  border: 1px solid black;
}

.scoreboard-title {
  margin-top: 0;
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
