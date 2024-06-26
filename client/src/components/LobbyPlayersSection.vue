<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import MenuButton from './MenuButton.vue'

const sessionStore = useSessionStore()
const player1Name = computed(() => sessionStore.player1Name)
const player2Name = computed(() => sessionStore.player2Name)
const playerIsHost = computed(() => sessionStore.playerIsHost)

const player1Editing = ref(false)
const player2Editing = ref(false)

const handleKickButtonClicked = () => {
  console.log('Kick button clicked')
}

const togglePlayer1Editing = () => {
  player1Editing.value = !player1Editing.value
}

const togglePlayer2Editing = () => {
  player2Editing.value = !player2Editing.value
}

const updatePlayer1Name = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value.length > 0) {
    sessionStore.setPlayer1Name(input.value)
    player1Editing.value = false
  }
}

const updatePlayer2Name = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value.length > 0) {
    sessionStore.setPlayer2Name(input.value)
    player2Editing.value = false
  }
}

window.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    player1Editing.value = false
    player2Editing.value = false
  }
})
</script>

<template>
  <h2>Players</h2>
  <div class="player-container">
    <div v-if="player1Editing">
      <input
        type="text"
        :value="player1Name"
        @blur="player1Editing = false"
        @keyup.enter="updatePlayer1Name"
        class="player-name-input"
      />
    </div>
    <div v-else class="player-name-container">
      <p
        @click="playerIsHost ? togglePlayer1Editing() : null"
        class="player-name"
        :class="{ notEditable: !playerIsHost }"
      >
        {{ player1Name }}
      </p>
      <div v-if="playerIsHost" class="tooltip">Edit</div>
    </div>
    <p v-if="playerIsHost" class="player-tag"><b>HOST (YOU)</b></p>
    <p v-else class="player-tag"><b>HOST</b></p>
  </div>
  <div class="player-container player2-container">
    <div v-if="player2Editing">
      <input
        type="text"
        :value="player2Name"
        @blur="player2Editing = false"
        @keyup.enter="updatePlayer2Name"
        class="player-name-input"
      />
    </div>
    <div v-else class="player-name-container">
      <p
        @click="!playerIsHost ? togglePlayer2Editing() : null"
        class="player-name"
        :class="{ notEditable: playerIsHost }"
      >
        {{ player2Name }}
      </p>
      <div v-if="!playerIsHost" class="tooltip">Edit</div>
    </div>
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
  height: 55px;
}

.player2-container {
  margin-top: 25px;
}

.player-name-container {
  position: relative;
}

.player-name {
  font-size: 1.1rem;
  line-height: 1rem;
  cursor: pointer;
  width: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  padding: 1rem 0;
  margin: 0;
}

.player-name-input {
  padding: 0;
  font-family: inherit;
  font-size: 1.1rem;
  line-height: 1rem;
  border: none;
  outline: none;
  border-bottom: 1px solid black;
  width: 125px;
}

.notEditable {
  cursor: default;
}

.player-tag {
  font-size: 0.8rem;
}

.tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 0.25rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  position: absolute;
  z-index: 1;
  bottom: -1.3rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.player-name-container:hover .tooltip {
  visibility: visible;
}
</style>
