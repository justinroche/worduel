<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import GameTable from '../gameBoard/GameTable.vue'
import Scoreboard from '../Scoreboard.vue'
import { getScoreFromGuessCount } from '../../utils/gameUtils'
import MenuButton from '../MenuButton.vue'
import { nextRound } from '../../clients/SessionClient'

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

const nextRoundButtonLoading = ref(false)

const handleNextRoundButton = async () => {
  nextRoundButtonLoading.value = true
  await nextRound()
  nextRoundButtonLoading.value = false
}
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h2>Round {{ currentRound }} Complete</h2>
      <div class="result-tables">
        <div class="result-table">
          <h3 class="player-name">{{ player1Name }}</h3>
          <game-table
            :guesses="
              wordThatPlayer1Guessed.guesses.map((guess) => guess.split(''))
            "
            :results="wordThatPlayer1Guessed.results"
            :scale="2"
          />
          <div class="score-container">
            <p class="word-score">
              <b>
                +{{ getScoreFromGuessCount(wordThatPlayer1Guessed.guessedIn!) }}
                points
              </b>
            </p>
            <p
              v-if="wordThatPlayer1Guessed.guessedIn! === 7"
              class="word-answer"
            >
              (Answer: <b>{{ wordThatPlayer1Guessed.word }}</b
              >)
            </p>
          </div>
        </div>
        <div class="result-table">
          <h3 class="player-name">{{ player2Name }}</h3>
          <game-table
            :guesses="
              wordThatPlayer2Guessed.guesses.map((guess) => guess.split(''))
            "
            :results="wordThatPlayer2Guessed.results"
            :scale="2"
          />
          <div class="score-container">
            <p class="word-score">
              <b>
                +{{ getScoreFromGuessCount(wordThatPlayer2Guessed.guessedIn!) }}
                points
              </b>
            </p>
            <p
              v-if="wordThatPlayer2Guessed.guessedIn! === 7"
              class="word-answer"
            >
              (Answer: <b>{{ wordThatPlayer2Guessed.word }}</b
              >)
            </p>
          </div>
        </div>
      </div>
      <div class="scoreboard">
        <h3>Scoreboard</h3>
        <scoreboard />
      </div>
      <menu-button
        v-if="sessionStore.getPlayerIsHost"
        buttonText="Next Round"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="atomic-tangerine"
        @click="handleNextRoundButton"
        :loading="nextRoundButtonLoading"
      />
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-tables {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.result-table {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-name {
  line-height: 1rem;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0 0.75rem 0;
  margin: 0;
}

.score-container {
  height: 55px;
}

.word-score {
  margin: 0.5rem 0 0 0;
}

.word-answer {
  margin: 0.25rem 0 0 0;
  font-style: italic;
  font-size: 0.8rem;
}

.scoreboard {
  margin-bottom: 1.25rem;
}

.scoreboard h3 {
  margin: 0 0 0.5rem 0;
}
</style>
