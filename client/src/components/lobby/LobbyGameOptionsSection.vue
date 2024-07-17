<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import {
  updateRounds,
  updateSpellCheckEnabled,
  updateBlockProfanityEnabled,
  updateRoundTimerEnabled,
  updateRoundTimerDuration,
} from '../../clients/SessionClient'

const props = defineProps<{
  isLobby: boolean
}>()

const sessionStore = useSessionStore()
const playerIsHost = computed(() => sessionStore.playerIsHost)
const rounds = computed(() => sessionStore.rounds)
const MAX_ROUNDS = sessionStore.getMaxRounds

const spellCheckEnabled = computed(() => sessionStore.spellCheckEnabled)
const blockProfanityEnabled = computed(() => sessionStore.blockProfanityEnabled)
const roundTimerEnabled = computed(() => sessionStore.roundTimerEnabled)
const roundTimerDuration = computed(() => sessionStore.roundTimerDuration)
const roundTimerDurationFormatted = computed(
  () => sessionStore.getRoundTimerDurationFormatted
)

const handleAddRoundButton = () => {
  if (playerIsHost.value && props.isLobby && rounds.value < MAX_ROUNDS) {
    updateRounds(rounds.value + 1)
  }
}

const handleSubtractRoundButton = () => {
  if (playerIsHost.value && props.isLobby && rounds.value > 1) {
    updateRounds(rounds.value - 1)
  }
}

const toggleSpellCheckEnabled = () => {
  if (playerIsHost.value && props.isLobby) {
    updateSpellCheckEnabled(!spellCheckEnabled.value)
  }
}

const toggleBlockProfanity = () => {
  if (playerIsHost.value && props.isLobby) {
    updateBlockProfanityEnabled(!blockProfanityEnabled.value)
  }
}

const toggleRoundTimer = () => {
  if (playerIsHost.value && props.isLobby) {
    updateRoundTimerEnabled(!roundTimerEnabled.value)
  }
}

const handleAddTimeButton = () => {
  if (playerIsHost.value && props.isLobby && roundTimerDuration.value < 300) {
    updateRoundTimerDuration(roundTimerDuration.value + 15)
  }
}

const handleSubtractTimeButton = () => {
  if (playerIsHost.value && props.isLobby && roundTimerDuration.value > 15) {
    updateRoundTimerDuration(roundTimerDuration.value - 15)
  }
}
</script>

<template>
  <div v-if="playerIsHost && props.isLobby">
    <h2>Game Options</h2>
    <div class="game-option">
      <p>Rounds</p>
      <div class="game-option-number-picker">
        <button class="game-option-button" @click="handleSubtractRoundButton">
          <font-awesome-icon :icon="['fas', 'circle-chevron-left']" size="2x" />
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
        <font-awesome-icon v-else :icon="['fas', 'square-check']" size="2x" />
      </button>
    </div>
    <div class="game-option">
      <p>Block Profanity</p>
      <button class="game-option-button" @click="toggleBlockProfanity">
        <font-awesome-icon
          v-if="!blockProfanityEnabled"
          :icon="['far', 'square']"
          size="2x"
        />
        <font-awesome-icon v-else :icon="['fas', 'square-check']" size="2x" />
      </button>
    </div>
    <div class="game-option">
      <p>Round Timer</p>
      <button class="game-option-button" @click="toggleRoundTimer">
        <font-awesome-icon
          v-if="!roundTimerEnabled"
          :icon="['far', 'square']"
          size="2x"
        />
        <font-awesome-icon v-else :icon="['fas', 'square-check']" size="2x" />
      </button>
    </div>
    <div v-if="roundTimerEnabled" class="game-option">
      <p></p>
      <div class="game-option-number-picker">
        <button class="game-option-button" @click="handleSubtractTimeButton">
          <font-awesome-icon :icon="['fas', 'circle-minus']" size="2x" />
        </button>
        <p class="round-timer">{{ roundTimerDurationFormatted }}</p>
        <button class="game-option-button" @click="handleAddTimeButton">
          <font-awesome-icon :icon="['fas', 'circle-plus']" size="2x" />
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <h2 v-if="props.isLobby">Game Options</h2>
    <div class="game-option">
      <p>Rounds</p>
      <p class="rounds-counter-not-host">{{ rounds }}</p>
    </div>
    <div class="game-option">
      <p>Use Spell Check</p>
      <p v-if="!spellCheckEnabled" class="setting-label-text"><b>OFF</b></p>
      <p v-else class="setting-label-text"><b>ON</b></p>
    </div>

    <div class="game-option">
      <p>Block Profanity</p>
      <p v-if="!blockProfanityEnabled" class="setting-label-text"><b>OFF</b></p>
      <p v-else class="setting-label-text"><b>ON</b></p>
    </div>
    <div class="game-option">
      <p>Round Timer</p>
      <p v-if="!roundTimerEnabled" class="setting-label-text"><b>OFF</b></p>
      <p v-else class="round-timer-not-host">
        {{ roundTimerDurationFormatted }}
      </p>
    </div>
  </div>
</template>

<style scoped>
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

.game-option-check {
  width: 23.33px;
  height: 26.67px;
}

.game-option-button:hover .fa-circle-chevron-right,
.game-option-button:hover .fa-circle-chevron-left,
.game-option-button:hover .fa-square-check,
.game-option-button:hover .fa-square,
.game-option-button:hover .fa-circle-plus,
.game-option-button:hover .fa-circle-minus {
  color: #443b3d;
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

.rounds-counter-not-host,
.round-timer-not-host {
  font-size: 1.5rem;
}
</style>
