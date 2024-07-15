import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocalRoundStore = defineStore('localRound', () => {
  // State
  const guesses = ref(
    Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ''))
  )
  const results = ref<string[][]>([])

  const currentLetter = ref(0)
  const currentRow = ref(0)

  const letters: string[][] = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ]
  const letterLabels = ref<string[][]>(
    letters.map((row) => row.map(() => 'unused'))
  )

  // Setters
  const setGuesses = (newGuesses: string[][]) => {
    guesses.value = newGuesses
  }
  const setResults = (newResults: string[][]) => {
    results.value = newResults
  }
  const setCurrentLetter = (newCurrentLetter: number) => {
    currentLetter.value = newCurrentLetter
  }
  const setCurrentRow = (newCurrentRow: number) => {
    currentRow.value = newCurrentRow
  }
  const setLetterLabels = (newLetterLabels: string[][]) => {
    letterLabels.value = newLetterLabels
  }

  // Actions
  const reset = () => {
    guesses.value = Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => '')
    )
    results.value = []
    currentLetter.value = 0
    currentRow.value = 0
    letterLabels.value = letters.map((row) => row.map(() => 'unused'))
  }

  return {
    // State
    guesses,
    results,
    currentLetter,
    currentRow,
    letters,
    letterLabels,
    // Setters
    setGuesses,
    setResults,
    setCurrentLetter,
    setCurrentRow,
    setLetterLabels,
    // Actions
    reset,
  }
})
