<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSessionStore } from '../stores/SessionStore'
import { isWordInDictionary } from '../utils/dictionaryUtils'
import MenuButton from './MenuButton.vue'

const sessionStore = useSessionStore()
const currentRound = computed(() => sessionStore.getCurrentRound)

const word = ref('')
const confirmButtonLoading = ref(false)

// Convert word to uppercase
watch(word, (newValue) => {
  word.value = newValue.toUpperCase()
})

const handleConfirmButton = () => {
  if (word.value.length !== 5) {
    return
  }
  confirmButtonLoading.value = true
  if (!isWordInDictionary(word.value)) {
    return
  }
  // TODO: Process word
  confirmButtonLoading.value = false
}
</script>

<template>
  <div class="overlay">
    <div class="enter-word-box">
      <h2>Round {{ currentRound }}</h2>
      <input type="text" v-model="word" maxlength="5" class="word-input" />
      <p>Enter a word for your opponent to guess</p>
      <menu-button
        buttonText="Confirm"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="atomic-tangerine"
        @click="handleConfirmButton"
        :loading="confirmButtonLoading"
        class="confirm-button"
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
}
</style>
