<script setup lang="ts">
import { ref } from 'vue'

const player1Name = 'Player 1'
const player2Name = 'Player 2'
const playerIsHost = ref(true)

const handleKickButtonClicked = () => {
  console.log('Kick button clicked')
}
</script>

<template>
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
</template>

<style scoped>
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
  background-color: var(--auburn);
  border: 1px solid var(--auburn-border);
  box-sizing: border-box;
  color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.kick-button:hover {
  background-color: var(--auburn-hover);
}

.kick-button:active {
  background-color: var(--auburn-active);
}
</style>
