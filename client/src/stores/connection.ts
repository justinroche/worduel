import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    isConnected: true, // Assume connected initially
  }),
  actions: {
    setConnectionStatus(status: boolean) {
      this.isConnected = status
    },
  },
})
