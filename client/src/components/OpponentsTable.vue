<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import GameTable from './gameBoard/GameTable.vue'

const sessionStore = useSessionStore()
const currentRound = computed(() => sessionStore.getCurrentRound)
const opponentNumber = computed(() => (sessionStore.getPlayerIsHost ? 2 : 1))

const wordThatOpponentIsGuessing = computed(
  () =>
    sessionStore.getGames[currentRound.value - 1].words.filter(
      (word) => word.wordSetter !== opponentNumber.value
    )[0]
)
</script>

<template>
  <div class="table">
    <h3 class="player-name">
      {{
        sessionStore.getPlayerIsHost
          ? sessionStore.getPlayer2Name
          : sessionStore.getPlayer1Name
      }}
    </h3>
    <game-table
      :guesses="
        wordThatOpponentIsGuessing.guesses.map((guess) => guess.split(''))
      "
      :results="wordThatOpponentIsGuessing.results"
      :scale="2"
    />
    <p class="word-answer">
      (Answer: <b>{{ wordThatOpponentIsGuessing.word }}</b
      >)
    </p>
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
