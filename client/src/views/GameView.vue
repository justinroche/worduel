<script setup lang="ts">
/* Imports */
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import GameTable from '../components/gameBoard/GameTable.vue'
import Keyboard from '../components/gameBoard/Keyboard.vue'
import { isWordInDictionary } from '../utils/dictionaryUtils'
import { useSessionStore } from '../stores/SessionStore'
import { useLocalRoundStore } from '../stores/LocalRoundStore'
import EnterWordBox from '../components/modals/EnterWordModal.vue'
import WaitingForOpponentModal from '../components/modals/WaitingForOpponentModal.vue'
import PostRoundModal from '../components/modals/PostRoundModal.vue'
import HeaderBanner from '../components/HeaderBanner.vue'
import { joinSession, madeGuess } from '../clients/SessionClient'
import router from '../router'

const sessionStore = useSessionStore()
const localRoundStore = useLocalRoundStore()
const route = useRoute()

onMounted(async () => {
  window.addEventListener('keydown', handleKeyPress)
  if (sessionStore.getSessionCode) {
    return
  }
  const gameCode = route.params.gameCode as string
  if (!gameCode) {
    router.push({ name: 'home' })
    return
  }
  await joinSession(gameCode.toUpperCase())
})

/* Computed state */
const playerNumber = computed(() => (sessionStore.playerIsHost ? 1 : 2))
const currentRound = computed(() => sessionStore.getCurrentRound)
const currentGame = computed(() =>
  sessionStore.getGames ? sessionStore.getGames[currentRound.value - 1] : null
)

const currentWords = computed(() => currentGame.value?.words)

const wordBeingGuessed = computed(
  () =>
    currentWords.value?.filter(
      (word) => word.wordSetter !== playerNumber.value
    )[0]
)

/* Keyboard event handler */
const handleKeyEvent = async (key: string) => {
  if (localRoundStore.currentRow >= 6) return
  if (wordBeingGuessed.value?.guessingComplete) return

  if (key === 'Enter') {
    if (localRoundStore.currentLetter !== 5) {
      return
    } else {
      const guess = localRoundStore.guesses[localRoundStore.currentRow]
      if (!isWordInDictionary(guess.join(''))) {
        return
      }

      if (wordBeingGuessed.value) {
        localRoundStore.results.push(
          getResults(guess, wordBeingGuessed.value.word)
        )
      }

      await madeGuess(
        guess.join(''),
        localRoundStore.results[localRoundStore.currentRow]
      )

      if (guess.join('') !== wordBeingGuessed.value?.word) {
        localRoundStore.currentRow++
        localRoundStore.currentLetter = 0
      }
    }
  } else if (key === 'Backspace') {
    if (localRoundStore.currentLetter === 0) {
      return
    } else {
      localRoundStore.currentLetter--
      localRoundStore.guesses[localRoundStore.currentRow][
        localRoundStore.currentLetter
      ] = ''
    }
  } else if (/^[a-zA-Z]$/.test(key) && localRoundStore.currentLetter < 5) {
    localRoundStore.guesses[localRoundStore.currentRow][
      localRoundStore.currentLetter
    ] = key.toUpperCase()
    localRoundStore.currentLetter++
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (currentGame.value?.state != 'in play') return
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

  localRoundStore.updateLetterLabels(guess, results)

  return results
}
</script>

<template>
  <header-banner :title="'Round ' + currentRound" />
  <div v-if="currentGame?.state === 'setting word'">
    <enter-word-box />
  </div>
  <div v-if="wordBeingGuessed ? wordBeingGuessed.guessingComplete : false">
    <waiting-for-opponent-modal />
  </div>
  <div v-if="currentGame?.state === 'complete'">
    <post-round-modal />
  </div>
  <div class="pageBody">
    <game-table
      :guesses="localRoundStore.guesses"
      :results="localRoundStore.results"
      :scale="3"
      class="gameTable"
    />
    <div class="keyboardContainer">
      <keyboard
        :letters="localRoundStore.letters"
        :letterLabels="localRoundStore.letterLabels"
        @key-event="handleKeyEvent"
      />
    </div>
  </div>
</template>

<style scoped>
.pageBody {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}

.gameTable {
  margin: 100px 0 275px 0;
}

.keyboardContainer {
  position: absolute;
  bottom: 75px;
}
</style>
