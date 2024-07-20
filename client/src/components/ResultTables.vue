<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import GameTable from './gameBoard/GameTable.vue'
import { getScoreFromGuessCount } from '../utils/gameUtils'

const props = withDefaults(
  defineProps<{
    round: number
  }>(),
  {
    round: 1,
  }
)

const sessionStore = useSessionStore()

const player1Name = computed(() => sessionStore.session.player1Name)
const player2Name = computed(() => sessionStore.session.player2Name)

const words = computed(() => sessionStore.getGames[props.round - 1].words)

const wordThatPlayer1Guessed = computed(
  () => words.value.filter((word) => word.wordSetter === 2)[0]
)
const wordThatPlayer2Guessed = computed(
  () => words.value.filter((word) => word.wordSetter === 1)[0]
)
</script>

<template>
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
        <p v-if="wordThatPlayer1Guessed.guessedIn! === 7" class="word-answer">
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
        <p v-if="wordThatPlayer2Guessed.guessedIn! === 7" class="word-answer">
          (Answer: <b>{{ wordThatPlayer2Guessed.word }}</b
          >)
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-tables {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  box-sizing: border-box;
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
</style>
