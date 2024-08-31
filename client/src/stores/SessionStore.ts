import { defineStore } from 'pinia'
import { Session } from '../types/Session'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const session = ref({} as Session)
  const playerIsHost = ref(false)
  const MAX_ROUNDS = 5
  const player2CountingDown = ref(false)

  const getRoundTimerDurationFormatted = computed(() => {
    const minutes = Math.floor(session.value.roundTimerDuration / 60)
    const seconds = session.value.roundTimerDuration % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  return {
    session,
    playerIsHost,
    MAX_ROUNDS,
    player2CountingDown,
    getRoundTimerDurationFormatted,
  }
})
