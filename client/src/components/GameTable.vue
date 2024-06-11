<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import GameRow from './GameRow.vue'

const secretWord = 'APPLE'
const currentGuess = reactive({
  row: 0,
  letters: ['', '', '', '', ''],
})
const guesses = ref<string[][]>([])
const results = ref<string[][]>([])
const gameState = ref('playing')

const handleKeyPress = (event: KeyboardEvent) => {
  console.log(event.key)

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

  return results
}

onMounted(() => {
  window.addEventListener('keyup', handleKeyPress)
})
</script>

<template>
  <div>
    <game-row
      v-for="row in 6"
      :key="row - 1"
      :currentGuess="currentGuess"
      :guessNumber="row - 1"
      :results="results[row - 1] ? results[row - 1] : []"
    />
  </div>
</template>

<style scoped></style>
