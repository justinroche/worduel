import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStateStore = defineStore('playerState', () => {
  const playerID = ref('')

  const setPlayerID = (id: string) => {
    playerID.value = id
  }

  return {
    playerID,
    setPlayerID,
  }
})
