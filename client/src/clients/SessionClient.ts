import { useSessionStore } from '../stores/SessionStore'
import { useLocalRoundStore } from '../stores/LocalRoundStore'
import { useHomeErrorStore } from '../stores/HomeErrorStore'
import { Session } from '../types/Session'

import { emitAsync, enqueue } from '../utils/socketUtils'
import socket from '../socket'
import router from '../router'

let sessionStore: ReturnType<typeof useSessionStore>
let localRoundStore: ReturnType<typeof useLocalRoundStore>
let homeErrorStore: ReturnType<typeof useHomeErrorStore>

export const initializeSessionClient = () => {
  sessionStore = useSessionStore()
  localRoundStore = useLocalRoundStore()
  homeErrorStore = useHomeErrorStore()

  /* Socket events */
  // Session state events
  socket.on('setSession', (session: Session) => {
    sessionStore.setSession(session)
  })

  socket.on('sessionCreated', () => {
    sessionStore.setPlayerIsHost(true)
  })

  socket.on('sessionJoined', (session: Session) => {
    if (!sessionStore.getPlayerIsHost) {
      sessionStore.setSession(session)
    }
    sessionStore.setPlayer2Connected(true)
  })

  socket.on('gameStarted', () => {
    router.push({ name: 'play' })
  })

  // Session player management events
  socket.on('player1Disconnected', (session: Session) => {
    if (!sessionStore.getPlayerIsHost) {
      sessionStore.setSession(session)
      sessionStore.setPlayerIsHost(true)
    } else {
      sessionStore.setPlayerIsHost(false) // Is this necessary?
    }
  })

  socket.on('player2Disconnected', () => {
    if (sessionStore.getPlayerIsHost) {
      sessionStore.setPlayer2Connected(false)
      sessionStore.setPlayer2Name('Player 2')
    }
  })

  socket.on('removePlayer2', async () => {
    if (!sessionStore.getPlayerIsHost) {
      await enqueue(() => emitAsync('leaveRoom'))
      router.push({ name: 'home' })
      homeErrorStore.setError('You were kicked from the lobby.')
    } else {
      sessionStore.setPlayer2Connected(false)
      sessionStore.setPlayer2Name('Player 2') // Is this necessary?
    }
  })

  // Game option events
  socket.on('player1NameUpdated', (name: string) => {
    if (!sessionStore.playerIsHost) sessionStore.setPlayer1Name(name)
  })

  socket.on('player2NameUpdated', (name: string) => {
    if (sessionStore.playerIsHost) sessionStore.setPlayer2Name(name)
  })

  socket.on('roundsUpdated', (rounds: number) => {
    if (!sessionStore.getPlayerIsHost) sessionStore.setRounds(rounds)
  })

  socket.on('spellCheckEnabledUpdated', (enabled: boolean) => {
    if (!sessionStore.getPlayerIsHost)
      sessionStore.setSpellCheckEnabled(enabled)
  })

  socket.on('blockProfanityEnabledUpdated', (enabled: boolean) => {
    if (!sessionStore.getPlayerIsHost)
      sessionStore.setBlockProfanityEnabled(enabled)
  })

  socket.on('roundTimerEnabledUpdated', (enabled: boolean) => {
    if (!sessionStore.getPlayerIsHost)
      sessionStore.setRoundTimerEnabled(enabled)
  })

  socket.on('roundTimerDurationUpdated', (duration: number) => {
    if (!sessionStore.getPlayerIsHost)
      sessionStore.setRoundTimerDuration(duration)
  })

  // Game events
  socket.on('resetLocalRoundState', () => {
    localRoundStore.reset()
  })

  socket.on('goToSummary', () => {
    router.push({ name: 'summary' })
  })
}

/* Client socket functions */
// Game option functions
export const updatePlayer1Name = (name: string) => {
  sessionStore.setPlayer1Name(name)
  return enqueue(() =>
    emitAsync('updatePlayer1Name', [name, sessionStore.getSessionCode])
  )
}

export const updatePlayer2Name = (name: string) => {
  sessionStore.setPlayer2Name(name)
  return enqueue(() =>
    emitAsync('updatePlayer2Name', [name, sessionStore.getSessionCode])
  )
}

export const updateRounds = (rounds: number) => {
  sessionStore.setRounds(rounds)
  return enqueue(() =>
    emitAsync('updateRounds', [rounds, sessionStore.getSessionCode])
  )
}

export const updateSpellCheckEnabled = (enabled: boolean) => {
  sessionStore.setSpellCheckEnabled(enabled)
  return enqueue(() =>
    emitAsync('updateSpellCheckEnabled', [enabled, sessionStore.getSessionCode])
  )
}

export const updateBlockProfanityEnabled = (enabled: boolean) => {
  sessionStore.setBlockProfanityEnabled(enabled)
  return enqueue(() =>
    emitAsync('updateBlockProfanityEnabled', [
      enabled,
      sessionStore.getSessionCode,
    ])
  )
}

export const updateRoundTimerEnabled = (enabled: boolean) => {
  sessionStore.setRoundTimerEnabled(enabled)
  return enqueue(() =>
    emitAsync('updateRoundTimerEnabled', [enabled, sessionStore.getSessionCode])
  )
}

export const updateRoundTimerDuration = (duration: number) => {
  sessionStore.setRoundTimerDuration(duration)
  return enqueue(() =>
    emitAsync('updateRoundTimerDuration', [
      duration,
      sessionStore.getSessionCode,
    ])
  )
}

/* Async client socket functions */
export const createSession = async () => {
  return await enqueue(() => emitAsync('createSession'))
}

export const joinSession = async (sessionCode: string) => {
  return await enqueue(() => emitAsync('joinSession', sessionCode))
}

export const exitSession = async (playerNumber: 1 | 2) => {
  return await enqueue(() =>
    emitAsync('exitSession', [playerNumber, sessionStore.getSessionCode])
  )
}

export const startGame = async () => {
  return await enqueue(() =>
    emitAsync('startGame', sessionStore.getSessionCode)
  )
}

export const kickPlayer2 = async () => {
  return await enqueue(() =>
    emitAsync('kickPlayer2', sessionStore.getSessionCode)
  )
}

// Game functions
export const setWord = async (word: string) => {
  const playerNumber = sessionStore.getPlayerIsHost ? 1 : 2
  return await enqueue(() =>
    emitAsync('setWord', [word, playerNumber, sessionStore.getSessionCode])
  )
}

export const madeGuess = async (guess: string, results: string[]) => {
  const playerNumber = sessionStore.getPlayerIsHost ? 1 : 2
  return await enqueue(() =>
    emitAsync('madeGuess', [
      guess,
      results,
      playerNumber,
      sessionStore.getSessionCode,
    ])
  )
}

export const nextRound = async () => {
  return await enqueue(() =>
    emitAsync('nextRound', sessionStore.getSessionCode)
  )
}

export const endGame = async () => {
  return await enqueue(() => emitAsync('endGame', sessionStore.getSessionCode))
}

export const leaveRoom = async () => {
  sessionStore.setPlayerIsHost(false)
  return await enqueue(() => emitAsync('leaveRoom'))
}
