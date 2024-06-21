<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const gameCode = route.query.gameCode || 'No game code provided'
</script>

<template>
  <div class="lobby-view">
    <div class="top-row">
      <div class="player-container">
        <h2>Player 1</h2>
        <p>Host</p>
        <h2>Player 2</h2>
        <p>You</p>
      </div>
      <div class="lobby-details">
        <h1>Lobby Code</h1>
        <p>{{ gameCode }}</p>
      </div>
    </div>
    <div class="bottom-row">
      <div class="host-buttons">
        <button class="lobby-button start-button">Start Game</button>
        <button class="lobby-button cancel-button">Cancel Game</button>
      </div>
      <div class="server-options">
        <h2>Server Options</h2>
        <p>Rounds</p>
        <p>Use Spell Check</p>
        <p>Block Swear Words</p>
        <p>Round Timer</p>
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
  justify-content: space-between;
  align-items: center;
  width: 25vw;
}

.host-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
