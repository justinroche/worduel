<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import { getScoreFromGuessCount, getTotalScore } from '../utils/gameUtils'

const sessionStore = useSessionStore()

const player1Name = computed(() => sessionStore.session.player1Name)
const player2Name = computed(() => sessionStore.session.player2Name)
const numberOfRounds = computed(() => sessionStore.session.rounds)
const games = computed(() => sessionStore.session.games)

const getRoundScoreDisplay = (round: number, playerNumber: 1 | 2) => {
  if (
    games.value[round - 1].words.filter(
      (word) => word.wordSetter !== playerNumber
    ).length !== 0
  ) {
    return getScoreFromGuessCount(
      games.value[round - 1].words.filter(
        (word) => word.wordSetter !== playerNumber
      )[0].guessedIn!
    )
  } else {
    return ''
  }
}
</script>

<template>
  <div class="scoreboard-container">
    <table class="scoreboard">
      <tr>
        <th class="first-col"></th>
        <th class="player-col">
          <p class="player-name">{{ player1Name }}</p>
        </th>
        <th class="player-col">
          <p class="player-name">{{ player2Name }}</p>
        </th>
      </tr>
      <tr v-for="round in numberOfRounds" :key="round" class="score-row">
        <td class="round-number">{{ round }}</td>
        <template v-if="games[round - 1].state === 'in play'">
          <td colspan="2" class="in-progress">in progress...</td>
        </template>
        <template v-else>
          <td class="score">
            {{ getRoundScoreDisplay(round, 1) }}
          </td>
          <td class="score">
            {{ getRoundScoreDisplay(round, 2) }}
          </td>
        </template>
      </tr>
      <tr class="total-row">
        <td class="total-text">TOTAL</td>
        <td class="score">{{ getTotalScore(1) }}</td>
        <td class="score">{{ getTotalScore(2) }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.scoreboard {
  border-collapse: collapse;
  table-layout: fixed;
  height: auto;
  width: 100%;
}

.scoreboard th,
.scoreboard td {
  border: 1px solid black;
  padding: 4px;
  text-align: center;
}

.first-col {
  width: 12%;
}

.scoreboard th:first-child,
.scoreboard td:first-child {
  border-left: none;
}

.scoreboard th:last-child,
.scoreboard td:last-child {
  border-right: none;
}

.scoreboard tr:first-child th {
  border-top: none;
}

.scoreboard tr:last-child td {
  border-bottom: none;
}

.player-name {
  font-size: 1.1rem;
  line-height: 1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0 0.25rem 0;
  margin: 0;
}

tr {
  height: 40px;
}

.round-number,
.total-row,
.score {
  font-weight: bold;
}

.score {
  font-size: 1.25rem;
}

.in-progress {
  font-style: italic;
}

.total-text {
  font-size: 0.65rem;
}
</style>
