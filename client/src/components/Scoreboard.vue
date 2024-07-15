<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import { getScoreFromGuessCount } from '../utils/gameUtils'

const sessionStore = useSessionStore()

const player1Name = computed(() => sessionStore.getPlayer1Name)
const player2Name = computed(() => sessionStore.getPlayer2Name)
const numberOfRounds = computed(() => sessionStore.getRounds)
const games = computed(() => sessionStore.getGames)

const getRoundScore = (round: number, playerNumber: 1 | 2): number => {
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
    return 0
  }
}

const getTotalScore = (playerNumber: 1 | 2) => {
  let total = 0
  for (let i = 0; i < numberOfRounds.value; i++) {
    total += getRoundScore(i + 1, playerNumber)
  }
  return total
}

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
</template>

<style scoped>
.scoreboard {
  border-collapse: collapse;
  min-width: 300px;
  width: 300px;
  height: 280px;
}

.scoreboard th,
.scoreboard td {
  border: 1px solid black;
  padding: 4px;
  text-align: center;
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
  width: 115px;
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

.round-number {
  font-weight: bold;
}

.score {
  font-weight: bold;
  font-size: 1.25rem;
}

.in-progress {
  font-style: italic;
}

.total-row {
  font-weight: bold;
}

.total-text {
  font-size: 0.65rem;
}
</style>
