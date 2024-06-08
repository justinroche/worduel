<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import GameRow from './GameRow.vue'

const secretWord = 'APPLE' // Replace with the actual secret word
const currentGuess = reactive({
  row: 0,
  letters: ['', '', '', '', ''],
})
const guesses = ref<string[][]>([])

const handleKeyPress = (event: KeyboardEvent) => {
  if (currentGuess.row >= 6) return

  if (event.key === 'Enter') {
    if (currentGuess.letters.join('') === secretWord) {
      alert('Congratulations! You guessed the word!')
    } else {
      guesses.value.push([...currentGuess.letters])
      currentGuess.row++
      currentGuess.letters = ['', '', '', '', '']
    }
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
    />
  </div>
</template>

<style scoped></style>
