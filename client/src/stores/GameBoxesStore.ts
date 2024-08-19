import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameBoxesStore = defineStore('gameBoxes', () => {
  const showScoreboard = ref(false)
  const showOpponentsGuesses = ref(false)

  const handleToggleScoreboard = () => {
    showScoreboard.value = !showScoreboard.value
  }

  const handleToggleOpponentsGuesses = () => {
    showOpponentsGuesses.value = !showOpponentsGuesses.value
  }

  const reset = () => {
    showScoreboard.value = false
    showOpponentsGuesses.value = false
  }

  return {
    showScoreboard,
    showOpponentsGuesses,
    handleToggleScoreboard,
    handleToggleOpponentsGuesses,
    reset,
  }
})
