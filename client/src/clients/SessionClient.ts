import { useSessionStore } from '../stores/SessionStore'
import { Session } from '../types/Session'

import { emitAsync } from '../utils/socketUtils'
import { socket } from '../utils/socketInstance'

let sessionStore: ReturnType<typeof useSessionStore>

export const initializeSessionClient = () => {
  sessionStore = useSessionStore()

  socket.on('sessionCreated', (session: Session) => {
    sessionStore.setSessionCode(session.sessionCode)
    sessionStore.setPlayerIsHost(true)
  })

  socket.on('sessionJoined', (session: Session) => {
    if (!sessionStore.getPlayerIsHost) {
      sessionStore.setSessionCode(session.sessionCode)
      sessionStore.setPlayer1Name(session.player1Name)
    }
    sessionStore.setPlayer2Connected(true)
  })

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

export const updatePlayer1Name = async (name: string) => {
  return await emitAsync('updatePlayer1Name', [
    name,
    sessionStore.getSessionCode,
  ])
}

export const updatePlayer2Name = async (name: string) => {
  return await emitAsync('updatePlayer2Name', [
    name,
    sessionStore.getSessionCode,
  ])
}

export const updateRounds = async (rounds: number) => {
  return await emitAsync('updateRounds', [rounds, sessionStore.getSessionCode])
}

export const updateSpellCheckEnabled = async (enabled: boolean) => {
  return await emitAsync('updateSpellCheckEnabled', [
    enabled,
    sessionStore.getSessionCode,
  ])
}

export const updateBlockProfanityEnabled = (enabled: boolean) => {
  return emitAsync('updateBlockProfanityEnabled', [
    enabled,
    sessionStore.getSessionCode,
  ])
}

export const updateRoundTimerEnabled = (enabled: boolean) => {
  return emitAsync('updateRoundTimerEnabled', [
    enabled,
    sessionStore.getSessionCode,
  ])
}

export const updateRoundTimerDuration = (duration: number) => {
  return emitAsync('updateRoundTimerDuration', [
    duration,
    sessionStore.getSessionCode,
  ])
}

export const createSession = async () => {
  return await emitAsync('createSession')
}

export const joinSession = async (sessionCode: string) => {
  return await emitAsync('joinSession', sessionCode)
}
