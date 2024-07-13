<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import GameTable from '../gameBoard/GameTable.vue'

const sessionStore = useSessionStore()

const currentRound = computed(() => sessionStore.getCurrentRound)
const words = computed(
  () => sessionStore.getGames[currentRound.value - 1].words
)

const player1Name = computed(() => sessionStore.getPlayer1Name)
const player2Name = computed(() => sessionStore.getPlayer2Name)

const wordThatPlayer1Guessed = computed(
  () => words.value.filter((word) => word.wordSetter === 2)[0]
)
const wordThatPlayer2Guessed = computed(
  () => words.value.filter((word) => word.wordSetter === 1)[0]
)
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h2>Round {{ currentRound }} Complete</h2>
      <div class="result-tables">
        <div>
          <h3 class="player-name">{{ player1Name }}</h3>
          <game-table
            :guesses="
              wordThatPlayer1Guessed.guesses.map((guess) => guess.split(''))
            "
            :results="wordThatPlayer1Guessed.results"
            :scale="2"
          />
        </div>
        <div>
          <h3 class="player-name">{{ player2Name }}</h3>
          <game-table
            :guesses="
              wordThatPlayer2Guessed.guesses.map((guess) => guess.split(''))
            "
            :results="wordThatPlayer2Guessed.results"
            :scale="2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal {
  width: 700px;
  height: 900px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
}

.result-tables {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.player-name {
  margin: 0;
  margin-bottom: 0.5rem;
}
</style>
