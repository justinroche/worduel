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
  const enterWordModalWord = ref('')
  const enterWordModalWaiting = ref(false)
  const enterWordModalCountingDown = ref(false)

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
  const setEnterWordModalWord = (word: string) => {
    enterWordModalWord.value = word
  }
  const setEnterWordModalWaiting = (value: boolean) => {
    enterWordModalWaiting.value = value
  }
  const setEnterWordModalCountingDown = (value: boolean) => {
    enterWordModalCountingDown.value = value
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
    enterWordModalWord.value = ''
    enterWordModalWaiting.value = false
    enterWordModalCountingDown.value = false
  }

  const updateLetterLabels = (guessedLetters: string[], results: string[]) => {
    guessedLetters.forEach((letter, index) => {
      const result = results[index]

      for (let i = 0; i < letters.length; i++) {
        const row = letters[i]
        const labelRow = letterLabels.value[i]
        const letterIndex = row.indexOf(letter)

        if (letterIndex !== -1) {
          const currentLabel = labelRow[letterIndex]

          // Update only if the new label has higher priority
          if (
            result === 'correct' ||
            (result === 'misplaced' && currentLabel !== 'correct') ||
            (result === 'incorrect' && currentLabel === 'unused')
          ) {
            labelRow[letterIndex] = result
          }
        }
      }
    })
  }

  return {
    // State
    guesses,
    results,
    currentLetter,
    currentRow,
    letters,
    letterLabels,
    enterWordModalWord,
    enterWordModalWaiting,
    enterWordModalCountingDown,
    // Setters
    setGuesses,
    setResults,
    setCurrentLetter,
    setCurrentRow,
    setLetterLabels,
    updateLetterLabels,
    setEnterWordModalWord,
    setEnterWordModalWaiting,
    setEnterWordModalCountingDown,
    // Actions
    reset,
  }
})
