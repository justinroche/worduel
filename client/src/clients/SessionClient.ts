import { useSessionStore } from '../stores/SessionStore'
import { useLocalRoundStore } from '../stores/LocalRoundStore'
import { useHomeErrorStore } from '../stores/HomeErrorStore'
import { usePlayerStateStore } from '../stores/PlayerStateStore'

import { Session } from '../types/Session'
import { emitAsync, enqueue } from '../utils/socketUtils'
import socket from '../socket'
import router from '../router'

let sessionStore: ReturnType<typeof useSessionStore>
let localRoundStore: ReturnType<typeof useLocalRoundStore>
let homeErrorStore: ReturnType<typeof useHomeErrorStore>
let playerStateStore: ReturnType<typeof usePlayerStateStore>

export const initializeSessionClient = () => {
  /* Initialize stores */
  sessionStore = useSessionStore()
  localRoundStore = useLocalRoundStore()
  homeErrorStore = useHomeErrorStore()
  playerStateStore = usePlayerStateStore()

  /* Socket events */
  // Session state events
  socket.on('setSession', (session: Session) => {
    sessionStore.session = session
  })

  socket.on('setPlayerIsHost', (value: boolean) => {
    sessionStore.playerIsHost = value
  })

  socket.on('setPlayer2Connected', (value: boolean) => {
    sessionStore.session.player2Connected = value
  })

  // Session player management events
  socket.on('player1Disconnected', (session: Session) => {
    if (!sessionStore.getPlayerIsHost) {
      sessionStore.session = session
      sessionStore.playerIsHost = true
    } else {
      sessionStore.playerIsHost = false
    }
  })

  socket.on('player2Disconnected', () => {
    if (sessionStore.getPlayerIsHost) {
      sessionStore.session.player2Connected = false
      sessionStore.session.player2Name = 'Player 2'
    }
  })

  socket.on('removePlayer2', async () => {
    if (!sessionStore.getPlayerIsHost) {
      await enqueue(() => emitAsync('leaveRoom'))
      router.push({ name: 'home' })
      homeErrorStore.setError('You were kicked from the lobby.')
    } else {
      sessionStore.session.player2Connected = false
      sessionStore.session.player2Name = 'Player 2'
    }
  })

  // Game events
  socket.on('resetLocalRoundState', () => {
    localRoundStore.reset()
  })

  socket.on('goToGameView', () => {
    router.push({ name: 'play' })
  })

  socket.on('goToSummaryView', () => {
    router.push({ name: 'summary' })
  })
}

/* Client socket functions */
export const updateGameOption = (option: keyof Session, value: any) => {
  ;(sessionStore.session as any)[option] = value
  return enqueue(() =>
    emitAsync('updateGameOption', [option, value, sessionStore.getSessionCode])
  )
}

/* Async client socket functions */
export const createSession = async () => {
  return await enqueue(() =>
    emitAsync('createSession', playerStateStore.playerID)
  )
}

export const joinSession = async (sessionCode: string) => {
  return await enqueue(() =>
    emitAsync('joinSession', [playerStateStore.playerID, sessionCode])
  )
}

export const exitSession = async (playerNumber: 1 | 2) => {
  return await enqueue(() =>
    emitAsync('exitSession', [playerNumber, sessionStore.getSessionCode])
  )
}

export const kickPlayer2 = async () => {
  return await enqueue(() =>
    emitAsync('kickPlayer2', sessionStore.getSessionCode)
  )
}

// Game functions
export const startGame = async () => {
  return await enqueue(() =>
    emitAsync('startGame', sessionStore.getSessionCode)
  )
}

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
  sessionStore.playerIsHost = false
  return await enqueue(() => emitAsync('leaveRoom'))
}
