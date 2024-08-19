<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import { getTotalScore } from '../utils/gameUtils'
import { useGameBoxesStore } from '../stores/GameBoxesStore'

const sessionStore = useSessionStore()
const gameBoxesStore = useGameBoxesStore()
const player1TotalScore = computed(() => getTotalScore(1))
const player2TotalScore = computed(() => getTotalScore(2))
</script>

<template>
  <div class="headerBanner">
    <div class="banner-section left">
      <button
        class="icon-button score-button"
        @click="gameBoxesStore.handleToggleScoreboard"
      >
        <h2 v-if="sessionStore.playerIsHost" class="scores">
          {{ player1TotalScore }}-{{ player2TotalScore }}
        </h2>
        <h2 v-else class="scores">
          {{ player2TotalScore }}-{{ player1TotalScore }}
        </h2>
      </button>
      <h2 class="code">{{ sessionStore.session.sessionCode }}</h2>
    </div>
    <div class="banner-section center">
      <h1 class="title">Round {{ sessionStore.session.currentRound }}</h1>
    </div>
    <div class="banner-section right">
      <button
        class="icon-button"
        @click="gameBoxesStore.handleToggleOpponentsGuesses"
      >
        <font-awesome-icon
          v-if="!gameBoxesStore.showOpponentsGuesses"
          :icon="['fas', 'eye']"
          size="2x"
          class="fa-icon"
        />
        <font-awesome-icon
          v-if="gameBoxesStore.showOpponentsGuesses"
          :icon="['fas', 'eye-slash']"
          size="2x"
          class="fa-icon"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.headerBanner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid black;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.banner-section {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.left {
  justify-content: flex-start;
}

.center {
  justify-content: center;
}

.right {
  justify-content: flex-end;
}

.headerBanner h1,
.headerBanner h2 {
  margin: 0;
}

.fa-icon {
  color: black;
  transition: color 0.1s ease;
}

.fa-icon:hover {
  color: #414d40;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.score-button {
  margin-right: 50px;
  font-family: inherit;
  font-size: 1rem;
  color: black;
  border-radius: 0.25rem;
  transition: border 0.1s ease;
  border: 1px solid transparent;

  box-sizing: border-box;
  padding: 0.25rem 0.5rem;
}

.scores {
  box-sizing: border-box;
}

.score-button:hover {
  border: 1px solid black;
}
</style>
