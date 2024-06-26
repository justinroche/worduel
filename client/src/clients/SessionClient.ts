import { io } from 'socket.io-client'
import { useSessionStore } from '../stores/SessionStore'

const socket = io('http://localhost:8080')

let sessionStore: ReturnType<typeof useSessionStore>

export const initializeSessionClient = () => {
  sessionStore = useSessionStore()

  socket.on('player1NameUpdated', (name: string) => {
    sessionStore.setPlayer1Name(name)
  })

  socket.on('player2NameUpdated', (name: string) => {
    sessionStore.setPlayer2Name(name)
  })

  socket.on('sessionCodeUpdated', (sessionCode: string) => {
    sessionStore.setSessionCode(sessionCode)
  })

  socket.on('roundsUpdated', (rounds: number) => {
    sessionStore.setRounds(rounds)
  })

  socket.on('spellCheckEnabledUpdated', (enabled: boolean) => {
    sessionStore.setSpellCheckEnabled(enabled)
  })

  socket.on('blockProfanityEnabledUpdated', (enabled: boolean) => {
    sessionStore.setBlockProfanityEnabled(enabled)
  })

  socket.on('roundTimerEnabledUpdated', (enabled: boolean) => {
    sessionStore.setRoundTimerEnabled(enabled)
  })

  socket.on('roundTimerDurationUpdated', (duration: number) => {
    sessionStore.setRoundTimerDuration(duration)
  })
}

export const updatePlayer1Name = (name: string) => {
  sessionStore.setPlayer1Name(name)
  socket.emit('updatePlayer1Name', name)
}

export const updatePlayer2Name = (name: string) => {
  sessionStore.setPlayer2Name(name)
  socket.emit('updatePlayer2Name', name)
}

export const updateSessionCode = (sessionCode: string) => {
  sessionStore.setSessionCode(sessionCode)
  socket.emit('updateSessionCode', sessionCode)
}

export const updateRounds = (rounds: number) => {
  sessionStore.setRounds(rounds)
  socket.emit('updateRounds', rounds)
}

export const updateSpellCheckEnabled = (enabled: boolean) => {
  sessionStore.setSpellCheckEnabled(enabled)
  socket.emit('updateSpellCheckEnabled', enabled)
}

export const updateBlockProfanityEnabled = (enabled: boolean) => {
  sessionStore.setBlockProfanityEnabled(enabled)
  socket.emit('updateBlockProfanityEnabled', enabled)
}

export const updateRoundTimerEnabled = (enabled: boolean) => {
  sessionStore.setRoundTimerEnabled(enabled)
  socket.emit('updateRoundTimerEnabled', enabled)
}

export const updateRoundTimerDuration = (duration: number) => {
  sessionStore.setRoundTimerDuration(duration)
  socket.emit('updateRoundTimerDuration', duration)
}

export default socket
