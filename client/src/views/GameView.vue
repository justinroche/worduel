<script setup lang="ts">
/* Imports */
import { ref, reactive, onMounted, computed } from 'vue'
import GameTable from '../components/GameTable.vue'
import Keyboard from '../components/Keyboard.vue'
import { isWordInDictionary } from '../utils/dictionaryUtils'
import { useSessionStore } from '../stores/SessionStore'
import EnterWordBox from '../components/EnterWordBox.vue'
import { madeGuess } from '../clients/SessionClient'

/* State */
const currentGuess = reactive({
  row: 0,
  letters: ['', '', '', '', ''],
})
const guesses = ref<string[][]>([])
const results = ref<string[][]>([])

const sessionStore = useSessionStore()

const currentRound = computed(() => sessionStore.getCurrentRound)
const currentRoundState = computed(
  () => sessionStore.getGames[currentRound.value - 1].state
)
const playerNumber = computed(() => (useSessionStore().playerIsHost ? 1 : 2))
const words = computed(
  () => useSessionStore().getGames[currentRound.value - 1].words
)

const wordObject = computed(() => {
  return words.value.filter((word) => word.wordSetter != playerNumber.value)[0]
})

const secretWord = computed(() => wordObject?.value.word)
const wordGuessed = computed(() => wordObject?.value.successfullyGuessed)

const letters: string[][] = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  'ZXCVBNM'.split(''),
]

/* Keyboard label state */
const letterLabels = ref<string[][]>(
  letters.map((row) => row.map(() => 'unused'))
)

/* Update keyboard labels */
function updateLabels(guessedLetters: string[], results: string[]) {
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
const handleKeyEvent = async (key: string) => {
  if (currentGuess.row >= 6) return
  if (wordGuessed.value) return

  if (key === 'Enter') {
    if (currentGuess.letters.join('').length !== 5) {
      return
    } else {
      if (!isWordInDictionary(currentGuess.letters.join(''))) {
        return
      }

      guesses.value.push([...currentGuess.letters])
      results.value.push(getResults(currentGuess.letters, secretWord.value))

      if (currentGuess.letters.join('') !== secretWord.value) {
        currentGuess.row++
        currentGuess.letters = ['', '', '', '', '']
      }
      await madeGuess(currentGuess.letters.join(''))
    }
  } else if (key === 'Backspace') {
    let lastIndex = currentGuess.letters.findIndex((letter) => letter === '')
    if (lastIndex === -1) {
      lastIndex = 5
    }
    currentGuess.letters[lastIndex - 1] = ''
  } else if (
    /^[a-zA-Z]$/.test(key) &&
    currentGuess.letters.join('').length < 5
  ) {
    const index = currentGuess.letters.findIndex((letter) => letter === '')
    if (index !== -1) {
      currentGuess.letters[index] = key.toUpperCase()
    }
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (currentRoundState.value != 'in play') return
  handleKeyEvent(event.key)
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

  updateLabels(guess, results)

  return results
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <div v-if="currentRoundState === 'setting word'">
    <enter-word-box />
  </div>
  <h1>Round {{ currentRound }}</h1>
  <game-table :currentGuess="currentGuess" :results="results" />
  <div class="keyboardContainer">
    <keyboard
      :letters="letters"
      :letterLabels="letterLabels"
      @key-event="handleKeyEvent"
    />
  </div>
</template>

<style scoped>
.keyboardContainer {
  margin-top: 100px;
}
</style>
