<script setup lang="ts">
/* Imports */
import { ref, reactive, onMounted } from 'vue'
import GameTable from './components/GameTable.vue'
import Keyboard from './components/Keyboard.vue'

/* State */
const secretWord = 'APPLE'
const currentGuess = reactive({
  row: 0,
  letters: ['', '', '', '', ''],
})
const guesses = ref<string[][]>([])
const results = ref<string[][]>([])
const gameState = ref('playing')

const letters: string[][] = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]

const letterLabels = ref<string[][]>(
  letters.map((row) => row.map(() => 'unused'))
)

function updateLabels(updates: string[][]) {
  const [guessedLetters, results] = updates
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

/* Keyboard event handler */
const handleKeyPress = (event: KeyboardEvent) => {
  if (currentGuess.row >= 6) return

  if (event.key === 'Enter') {
    if (currentGuess.letters.join('').length !== 5) return
    else {
      if (currentGuess.letters.join('') === secretWord) {
        gameState.value = 'solved'
      }

      guesses.value.push([...currentGuess.letters])
      results.value.push(getResults(currentGuess.letters, secretWord))
      currentGuess.row++
      currentGuess.letters = ['', '', '', '', '']
    }
  } else if (event.key === 'Backspace') {
    let lastIndex = currentGuess.letters.findIndex((letter) => letter === '')
    if (lastIndex === -1) {
      lastIndex = 5
    }
    currentGuess.letters[lastIndex - 1] = ''
  } else if (
    /^[a-zA-Z]$/.test(event.key) &&
    currentGuess.letters.join('').length < 5
  ) {
    const index = currentGuess.letters.findIndex((letter) => letter === '')
    if (index !== -1) {
      currentGuess.letters[index] = event.key.toUpperCase()
    }
  }
}

/* Submit word event handler */
function getResults(guess: string[], secretWord: string) {
  let results: string[] = []
  let secretWordArr = secretWord.split('')

  // Label correct letters
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretWordArr[i]) {
      results[i] = 'correct'
      secretWordArr[i] = ''
    }
  }

  // Label misplaced letters
  for (let i = 0; i < guess.length; i++) {
    if (results[i]) continue
    if (secretWordArr.includes(guess[i])) {
      results[i] = 'misplaced'
      secretWordArr[secretWordArr.indexOf(guess[i])] = ''
    }
  }

  // Label incorrect letters
  for (let i = 0; i < guess.length; i++) {
    if (!results[i]) {
      results[i] = 'incorrect'
    }
  }

  const keyboardLabelUpdates: string[][] = []
  keyboardLabelUpdates.push(guess)
  keyboardLabelUpdates.push(results)

  updateLabels(keyboardLabelUpdates)

  return results
}

onMounted(() => {
  window.addEventListener('keyup', handleKeyPress)
})
</script>

<template>
  <h1>Worduel</h1>
  <game-table :currentGuess="currentGuess" :results="results" />
  <div id="keyboardContainer">
    <keyboard id="keyboard" :letters="letters" :letterLabels="letterLabels" />
  </div>
</template>

<style scoped>
#keyboardContainer {
  margin-top: 100px;
}
</style>
