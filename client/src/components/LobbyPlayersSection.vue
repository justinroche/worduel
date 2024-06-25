<script setup lang="ts">
import { ref } from 'vue'
import MenuButton from './MenuButton.vue'

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
    <menu-button
      v-if="playerIsHost"
      buttonText="KICK"
      fontSize="0.8rem"
      buttonWidth="65px"
      buttonHeight="30px"
      buttonStyle="auburn"
      @click="handleKickButtonClicked"
    />
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
</style>
