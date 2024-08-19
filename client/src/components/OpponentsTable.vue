<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import GameTable from './gameBoard/GameTable.vue'

const sessionStore = useSessionStore()
const currentRound = computed(() => sessionStore.session.currentRound)
const opponentNumber = computed(() => (sessionStore.playerIsHost ? 2 : 1))

const wordThatOpponentIsGuessing = computed(() =>
  sessionStore.session.games[currentRound.value - 1].state !== 'setting word'
    ? sessionStore.session.games[currentRound.value - 1].words.filter(
        (word) => word.wordSetter !== opponentNumber.value
      )[0]
    : {
        word: '',
        guesses: [],
        results: [],
      }
)
</script>

<template>
  <div class="table">
    <h3 class="player-name">
      {{
        sessionStore.playerIsHost
          ? sessionStore.session.player2Name
          : sessionStore.session.player1Name
      }}
    </h3>
    <game-table
      v-if="
        sessionStore.session.games[currentRound - 1].state !== 'setting word'
      "
      :guesses="
        wordThatOpponentIsGuessing.guesses.map((guess) => guess.split(''))
      "
      :results="wordThatOpponentIsGuessing.results"
      :scale="2"
    />
    <game-table
      v-else
      :guesses="new Array(6).fill(new Array(5).fill(''))"
      :results="new Array(6).fill(new Array(5).fill(''))"
      :scale="2"
    />
    <p v-if="wordThatOpponentIsGuessing.word" class="word-answer">
      (Answer: <b>{{ wordThatOpponentIsGuessing.word }}</b
      >)
    </p>
    <p v-else class="word-answer">(Waiting...)</p>
  </div>
</template>

<style scoped>
.table {
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

.word-answer {
  margin: 0.25rem 0 0 0;
  font-style: italic;
  font-size: 0.8rem;
}
</style>
