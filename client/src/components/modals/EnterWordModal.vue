<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'
import { isWordInDictionary } from '../../utils/dictionaryUtils'
import MenuButton from '../MenuButton.vue'
import { setWord } from '../../clients/SessionClient'

const sessionStore = useSessionStore()
const currentRound = computed(() => sessionStore.getCurrentRound)

const word = ref('')
const confirmButtonLoading = ref(false)
const buttonState = ref('entering-word')

const buttonText = computed(() => {
  return buttonState.value === 'entering-word'
    ? 'Confirm'
    : 'Waiting for opponent...'
})

// Convert word to uppercase
watch(word, (newValue) => {
  word.value = newValue.toUpperCase()
})

const handleConfirmButton = async () => {
  if (buttonState.value === 'waiting') {
    return
  }

  if (word.value.length !== 5) {
    // TODO: Show error message
    return
  }

  confirmButtonLoading.value = true

  if (!isWordInDictionary(word.value)) {
    // TODO: Show error message
    confirmButtonLoading.value = false
    return
  }

  try {
    await setWord(word.value)
    buttonState.value = 'waiting'
  } catch (error) {
    console.error('Error submitting word:', error)
    // TODO: Handle error
  } finally {
    confirmButtonLoading.value = false
  }
}
</script>

<template>
  <div class="overlay">
    <div class="enter-word-box">
      <h2>Entering Round {{ currentRound }}</h2>
      <input
        type="text"
        v-model="word"
        maxlength="5"
        class="word-input"
        :disabled="buttonState !== 'entering-word'"
        @keydown.enter="handleConfirmButton"
      />
      <p>Enter a word for your opponent to guess</p>
      <menu-button
        :buttonText="buttonText"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="atomic-tangerine"
        @click="handleConfirmButton"
        :loading="confirmButtonLoading"
        :disabled="
          word.length !== 5 ||
          !isWordInDictionary(word) ||
          buttonState === 'waiting'
        "
        :class="{
          waiting: buttonState === 'waiting',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.enter-word-box {
  width: 420px;
  height: 265px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
}

.word-input {
  font-family: inherit;
  font-weight: 500;
  font-size: 48px;
  text-align: center;
  width: 270px;
  border: none;
  border-bottom: 2px solid #000;
  outline: none;
  background: transparent;
}

.word-input:disabled {
  opacity: 0.7;
}
</style>
