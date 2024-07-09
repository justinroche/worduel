import { defineStore } from 'pinia'
import { ref } from 'vue'
let messageTimeout: ReturnType<typeof setTimeout> | null = null
let showMessageTimeout: ReturnType<typeof setTimeout> | null = null

export const useHomeErrorStore = defineStore('homeError', () => {
  const message = ref('')
  const showMessage = ref(false)

  const setError = (newMessage: string) => {
    message.value = newMessage
    showMessage.value = true
    clearErrorAfterTimeout()
  }

  const clearErrorAfterTimeout = () => {
    if (messageTimeout) {
      clearTimeout(messageTimeout)
    }
    messageTimeout = setTimeout(() => {
      message.value = ''
    }, 6000)

    if (showMessageTimeout) {
      clearTimeout(showMessageTimeout)
    }
    showMessageTimeout = setTimeout(() => {
      showMessage.value = false
    }, 5000)
  }

  return { showMessage, message, setError }
})
