<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const gameCode = route.query.gameCode || 'No game code provided'

const player1Name = 'Player 1'
const player2Name = 'Player 2'
const playerIsHost = ref(false)

const handleKickButtonClicked = () => {
  console.log('Kick button clicked')
}
</script>

<template>
  <div class="lobby-view">
    <div class="top-row">
      <div class="players-section">
        <h2>Players</h2>
        <div class="player-container">
          <p class="player-name">{{ player1Name }}</p>
          <p v-if="playerIsHost" class="player-tag"><b>HOST (YOU)</b></p>
          <p v-else class="player-tag"><b>HOST</b></p>
        </div>
        <div class="player-container player2-container">
          <p class="player-name">{{ player2Name }}</p>
          <button
            v-if="playerIsHost"
            class="player-tag kick-button"
            @click="handleKickButtonClicked"
          >
            KICK
          </button>
          <p v-else class="player-tag"><b>YOU</b></p>
        </div>
      </div>
      <div class="lobby-section">
        <h2>Lobby Code</h2>
        <p>{{ gameCode }}</p>
      </div>
    </div>
    <div class="bottom-row">
      <div class="host-buttons-section">
        <button class="lobby-button start-button">Start Game</button>
        <button class="lobby-button cancel-button">Cancel Game</button>
      </div>
      <div class="server-options-section">
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
  align-items: center;
  gap: 150px;
}

.players-section,
.lobby-section,
.host-buttons-section,
.server-options-section {
  width: 250px;
  height: 250px;
}

.player-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border: 1px solid #3a3335;
  border-radius: 0.25rem;
  padding: 0 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.player2-container {
  margin-top: 25px;
}

.player-name {
  font-size: 1.1rem;
  line-height: 1rem;
}

.player-tag {
  font-size: 0.8rem;
}

.kick-button {
  font-family: inherit;
  font-weight: 600;
  background-color: #d21b27;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.kick-button:hover {
  background-color: #e12531;
}

.kick-button:active {
  background-color: #f02f3b;
}

.host-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
