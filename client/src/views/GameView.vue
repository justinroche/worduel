<script setup lang="ts">
/* Imports */
import { ref, onMounted, computed } from 'vue'
import GameTable from '../components/GameTable.vue'
import Keyboard from '../components/Keyboard.vue'
import { isWordInDictionary } from '../utils/dictionaryUtils'
import { useSessionStore } from '../stores/SessionStore'
import EnterWordBox from '../components/EnterWordBox.vue'
import PostRoundModal from '../components/PostRoundModal.vue'
import { madeGuess } from '../clients/SessionClient'

/* State */
const guesses = ref<string[][]>(
  Array.from({ length: 6 }, () => Array(5).fill(''))
)
const currentRow = ref(0)
const currentLetter = ref(0)
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
  if (currentRow.value >= 6) return
  if (wordGuessed.value) return

  if (key === 'Enter') {
    if (currentLetter.value !== 5) {
      return
    } else {
      const guess = guesses.value[currentRow.value]
      if (!isWordInDictionary(guess.join(''))) {
        return
      }

      results.value.push(getResults(guess, secretWord.value))

      if (guess.join('') !== secretWord.value) {
        currentRow.value++
        currentLetter.value = 0
      }
      await madeGuess(guess.join(''))
    }
  } else if (key === 'Backspace') {
    console.log(currentLetter.value)
    if (currentLetter.value === 0) {
      return
    } else {
      currentLetter.value--
      guesses.value[currentRow.value][currentLetter.value] = ''
    }
  } else if (/^[a-zA-Z]$/.test(key) && currentLetter.value < 5) {
    guesses.value[currentRow.value][currentLetter.value] = key.toUpperCase()
    currentLetter.value++
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
  <div v-if="currentRoundState === 'complete'">
    <post-round-modal />
  </div>
  <h1>Round {{ currentRound }}</h1>
  <game-table :guesses="guesses" :results="results" />
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
