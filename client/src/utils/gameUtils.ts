import { computed } from 'vue'
import { useSessionStore } from '../stores/SessionStore'

export const getScoreFromGuessCount = (guessedIn: number): number => {
  return 7 - guessedIn
}

export const getRoundScore = (round: number, playerNumber: 1 | 2): number => {
  const sessionStore = useSessionStore()

  const games = computed(() => sessionStore.session.games)

  console.log(games)

  if (
    games.value[round - 1].words.filter(
      (word) => word.wordSetter !== playerNumber
    ).length !== 0
  ) {
    if (
      games.value[round - 1].words.filter(
        (word) => word.wordSetter !== playerNumber
      )[0].guessedIn === undefined
    ) {
      return 0
    }

    return getScoreFromGuessCount(
      games.value[round - 1].words.filter(
        (word) => word.wordSetter !== playerNumber
      )[0].guessedIn!
    )
  } else {
    return 0
  }
}

export const getTotalScore = (playerNumber: 1 | 2) => {
  const sessionStore = useSessionStore()

  const numberOfRounds = computed(() => sessionStore.session.rounds)

  let total = 0
  for (let i = 0; i < numberOfRounds.value; i++) {
    total += getRoundScore(i + 1, playerNumber)
  }
  return total
}
