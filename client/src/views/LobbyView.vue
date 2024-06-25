<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import LobbyPlayersSection from '../components/LobbyPlayersSection.vue'

const route = useRoute()
const gameCode = route.query.gameCode || 'No game code provided'

const rounds = ref(3)
const MAX_ROUNDS = 10
const spellCheckEnabled = ref(true)
const swearBlockEnabled = ref(false)
const roundTimerEnabled = ref(false)

const handleAddRoundButton = () => {
  if (rounds.value < MAX_ROUNDS) rounds.value++
}

const handleSubtractRoundButton = () => {
  if (rounds.value > 1) rounds.value--
}

const toggleSpellCheckEnabled = () => {
  spellCheckEnabled.value = !spellCheckEnabled.value
}
</script>

<template>
  <div class="lobby-view">
    <div class="top-row">
      <div class="lobby-section">
        <h2>Lobby Code</h2>
        <p class="game-code">{{ gameCode }}</p>
      </div>
      <div class="players-section">
        <lobby-players-section />
      </div>
    </div>
    <div class="bottom-row">
      <div class="game-options-section">
        <h2>Game Options</h2>
        <div class="game-option">
          <p>Rounds</p>
          <div class="game-option-number-picker">
            <button
              class="game-option-button"
              @click="handleSubtractRoundButton"
            >
              <font-awesome-icon
                :icon="['fas', 'circle-chevron-left']"
                size="2x"
              />
            </button>
            <p class="rounds-counter">{{ rounds }}</p>
            <button class="game-option-button" @click="handleAddRoundButton">
              <font-awesome-icon
                :icon="['fas', 'circle-chevron-right']"
                size="2x"
              />
            </button>
          </div>
        </div>
        <div class="game-option">
          <p>Use Spell Check</p>
          <button class="game-option-button" @click="toggleSpellCheckEnabled">
            <font-awesome-icon
              v-if="!spellCheckEnabled"
              :icon="['far', 'square']"
              size="2x"
            />
            <font-awesome-icon
              v-else
              :icon="['fas', 'square-check']"
              size="2x"
            />
          </button>
        </div>
        <p>Block Swear Words</p>
        <p>Round Timer</p>
      </div>
      <div class="host-buttons-section">
        <button class="lobby-button start-button">Start Game</button>
        <button class="lobby-button cancel-button">Exit Lobby</button>
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

.game-code {
  font-size: 5rem;
  margin: 0;
  line-height: 8rem;
  font-weight: 600;
}

.game-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-option-number-picker {
  display: flex;
  gap: 10px;
}

.game-option p {
  text-align: left;
  margin: 5px 0;
}

.game-option-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.game-option-button:hover .fa-circle-chevron-right,
.game-option-button:hover .fa-circle-chevron-left {
  color: #443b3d;
}

.rounds-counter {
  font-size: 1.5rem;
  margin: 0px;
  width: 30px;
  text-align: center !important;
}

.host-buttons-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lobby-button {
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 250px;
}

.start-button {
  background-color: var(--atomic-tangerine);
  border: 2px solid var(--atomic-tangerine-border);
  box-sizing: border-box;
  margin-bottom: 20px;
}

.start-button:hover {
  background-color: var(--atomic-tangerine-hover);
}

.start-button:active {
  background-color: var(--atomic-tangerine-active);
}

.cancel-button {
  background-color: var(--taupe);
  border: 2px solid var(--taupe-border);
  box-sizing: border-box;
}

.cancel-button:hover {
  background-color: var(--taupe-hover);
}

.cancel-button:active {
  background-color: var(--taupe-active);
}
</style>
