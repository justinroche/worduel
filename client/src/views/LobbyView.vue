<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LobbyPlayersSection from '../components/LobbyPlayersSection.vue'
import MenuButton from '../components/MenuButton.vue'
import { useSessionStore } from '../stores/SessionStore'

const route = useRoute()
const MAX_ROUNDS = 10

const sessionStore = useSessionStore()

const sessionCode = computed(() => sessionStore.sessionCode)
const rounds = computed(() => sessionStore.rounds)

const playerIsHost = computed(() => sessionStore.playerIsHost)

const spellCheckEnabled = computed(() => sessionStore.spellCheckEnabled)
const blockProfanityEnabled = computed(() => sessionStore.blockProfanityEnabled)
const roundTimerEnabled = computed(() => sessionStore.roundTimerEnabled)
const roundTimerDuration = computed(() => sessionStore.roundTimerDuration)
const roundTimerDurationFormatted = computed(
  () => sessionStore.getRoundTimerDurationFormatted
)

const handleAddRoundButton = () => {
  if (playerIsHost.value && rounds.value < MAX_ROUNDS) {
    sessionStore.setRounds(rounds.value + 1)
  }
}

const handleSubtractRoundButton = () => {
  if (playerIsHost.value && rounds.value > 1) {
    sessionStore.setRounds(rounds.value - 1)
  }
}

const toggleSpellCheckEnabled = () => {
  if (playerIsHost.value) {
    sessionStore.setSpellCheckEnabled(!spellCheckEnabled.value)
  }
}

const toggleBlockProfanity = () => {
  if (playerIsHost.value) {
    sessionStore.setBlockProfanityEnabled(!blockProfanityEnabled.value)
  }
}

const toggleRoundTimer = () => {
  if (playerIsHost) {
    sessionStore.setRoundTimerEnabled(!roundTimerEnabled.value)
  }
}

const handleAddTimeButton = () => {
  if (playerIsHost.value && roundTimerDuration.value < 300) {
    sessionStore.setRoundTimerDuration(roundTimerDuration.value + 15)
  }
}

const handleSubtractTimeButton = () => {
  if (playerIsHost.value && roundTimerDuration.value > 15) {
    sessionStore.setRoundTimerDuration(roundTimerDuration.value - 15)
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
        <h2>Game Options</h2>
        <div class="game-option">
          <p>Rounds</p>
          <div class="game-option-number-picker">
            <button
              class="game-option-button"
              :class="{ 'game-option-button-disabled': !playerIsHost }"
              @click="handleSubtractRoundButton"
            >
              <font-awesome-icon
                :icon="['fas', 'circle-chevron-left']"
                size="2x"
              />
            </button>
            <p class="rounds-counter">{{ rounds }}</p>
            <button
              class="game-option-button"
              :class="{ 'game-option-button-disabled': !playerIsHost }"
              @click="handleAddRoundButton"
            >
              <font-awesome-icon
                :icon="['fas', 'circle-chevron-right']"
                size="2x"
              />
            </button>
          </div>
        </div>
        <div class="game-option">
          <p>Use Spell Check</p>
          <button
            class="game-option-button"
            :class="{ 'game-option-button-disabled': !playerIsHost }"
            @click="toggleSpellCheckEnabled"
          >
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
        <div class="game-option">
          <p>Block Profanity</p>
          <button
            class="game-option-button"
            :class="{ 'game-option-button-disabled': !playerIsHost }"
            @click="toggleBlockProfanity"
          >
            <font-awesome-icon
              v-if="!blockProfanityEnabled"
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
        <div class="game-option">
          <p>Round Timer</p>
          <button
            class="game-option-button"
            :class="{ 'game-option-button-disabled': !playerIsHost }"
            @click="toggleRoundTimer"
          >
            <font-awesome-icon
              v-if="!roundTimerEnabled"
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
        <div v-if="roundTimerEnabled" class="game-option">
          <p></p>
          <div class="game-option-number-picker">
            <button
              class="game-option-button"
              :class="{ 'game-option-button-disabled': !playerIsHost }"
              @click="handleSubtractTimeButton"
            >
              <font-awesome-icon :icon="['fas', 'circle-minus']" size="2x" />
            </button>
            <p class="round-timer">{{ roundTimerDurationFormatted }}</p>
            <button
              class="game-option-button"
              :class="{ 'game-option-button-disabled': !playerIsHost }"
              @click="handleAddTimeButton"
            >
              <font-awesome-icon :icon="['fas', 'circle-plus']" size="2x" />
            </button>
          </div>
        </div>
      </div>
      <div class="host-buttons-section">
        <menu-button
          buttonText="Start Game"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="atomic-tangerine"
          class="start-button"
        />
        <menu-button
          buttonText="Exit Lobby"
          fontSize="1rem"
          buttonWidth="250px"
          buttonHeight="40px"
          buttonStyle="taupe"
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
  font-size: 5rem;
  margin: 0;
  line-height: 8rem;
  font-weight: 600;
}

.game-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.game-option-number-picker {
  display: flex;
  gap: 10px;
}

.game-option p {
  text-align: left;
  margin: 0;
}

.game-option-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.game-option-button:hover .fa-circle-chevron-right,
.game-option-button:hover .fa-circle-chevron-left,
.game-option-button:hover .fa-square-check,
.game-option-button:hover .fa-square,
.game-option-button:hover .fa-circle-plus,
.game-option-button:hover .fa-circle-minus {
  color: #443b3d;
}

.game-option-button-disabled {
  cursor: not-allowed;
}

.rounds-counter {
  font-size: 1.5rem;
  width: 30px;
  text-align: center !important;
}

.round-timer {
  font-size: 1.5rem;
  width: 65px;
  text-align: center !important;
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
