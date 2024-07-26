import { useSessionStore } from '../stores/SessionStore'
import { useLocalRoundStore } from '../stores/LocalRoundStore'
import { useHomeErrorStore } from '../stores/HomeErrorStore'
import { usePlayerStateStore } from '../stores/PlayerStateStore'
import { useCurrentViewStore } from '../stores/CurrentViewStore'

import { Session } from '../types/Session'
import { emitAsync, enqueue } from '../utils/socketUtils'
import socket from '../socket'

let sessionStore: ReturnType<typeof useSessionStore>
let localRoundStore: ReturnType<typeof useLocalRoundStore>
let homeErrorStore: ReturnType<typeof useHomeErrorStore>
let playerStateStore: ReturnType<typeof usePlayerStateStore>
let currentViewStore: ReturnType<typeof useCurrentViewStore>

export const initializeSessionClient = () => {
  /* Initialize stores */
  sessionStore = useSessionStore()
  localRoundStore = useLocalRoundStore()
  homeErrorStore = useHomeErrorStore()
  playerStateStore = usePlayerStateStore()
  currentViewStore = useCurrentViewStore()

  /* Socket events */
  // Session state events
  socket.on('setSession', (session: Session) => {
    sessionStore.session = session
  })

  socket.on('setPlayerIsHost', (value: boolean) => {
    sessionStore.playerIsHost = value
  })

  // Session player management events
  socket.on('removePlayer2', async () => {
    if (!sessionStore.playerIsHost) {
      await enqueue(() =>
        emitAsync('leaveRoom', sessionStore.session.sessionCode)
      )
      currentViewStore.setCurrentView('home')
      homeErrorStore.setError('You were kicked from the lobby.')
    } else {
      sessionStore.session.player2Connected = false
      sessionStore.session.player2Name = 'Player 2'
      sessionStore.session.player2UUID = ''
      sessionStore.session.player2SocketId = ''
    }
  })

  // Game events
  socket.on('resetLocalRoundState', () => {
    localRoundStore.reset()
  })

  socket.on(
    'rejoinSetWordThisPlayerIsGuessingLocalRoundState',
    (guesses: string[], results: string[][]) => {
      localRoundStore.setGuesses(guesses.map((guess) => guess.split('')))
      localRoundStore.setResults(results)
      localRoundStore.setCurrentRow(results.length)
      guesses.forEach((guess, index) => {
        localRoundStore.updateLetterLabels(guess.split(''), results[index])
      })
    }
  )

  socket.on('rejoinSetWordThisPlayerSetLocalRoundState', (word: string) => {
    localRoundStore.setEnterWordModalWord(word)
    localRoundStore.setEnterWordModalWaiting(true)
  })

  socket.on('goToHomeView', () => {
    currentViewStore.setCurrentView('home')
  })

  socket.on('goToLobbyView', () => {
    currentViewStore.setCurrentView('lobby')
  })

  socket.on('goToGameView', () => {
    currentViewStore.setCurrentView('game')
  })

  socket.on('goToSummaryView', () => {
    currentViewStore.setCurrentView('summary')
  })
}

/* Client socket functions */
export const updateGameOption = (option: keyof Session, value: any) => {
  ;(sessionStore.session as any)[option] = value
  return enqueue(() =>
    emitAsync('updateGameOption', [
      option,
      value,
      sessionStore.session.sessionCode,
    ])
  )
}

/* Async client socket functions */
export const createSession = async () => {
  return await enqueue(() =>
    emitAsync('createSession', playerStateStore.playerID)
  )
}

export const joinSession = async (sessionCode: string) => {
  if (sessionCode.length === 0) {
    homeErrorStore.setError('Please enter a game code.')
    currentViewStore.setCurrentView('home')
    return
  }
  if (sessionCode.length !== 4) {
    homeErrorStore.setError('Game code must be 4 characters long.')
    currentViewStore.setCurrentView('home')
    return
  }
  return await enqueue(() =>
    emitAsync('joinSession', [playerStateStore.playerID, sessionCode])
  )
}

export const exitSession = async (playerNumber: 1 | 2) => {
  return await enqueue(() =>
    emitAsync('exitSession', [playerNumber, sessionStore.session.sessionCode])
  )
}

export const kickPlayer2 = async () => {
  return await enqueue(() =>
    emitAsync('kickPlayer2', sessionStore.session.sessionCode)
  )
}

// Game functions
export const startGame = async () => {
  return await enqueue(() =>
    emitAsync('startGame', sessionStore.session.sessionCode)
  )
}

export const setWord = async (word: string) => {
  const playerNumber = sessionStore.playerIsHost ? 1 : 2
  return await enqueue(() =>
    emitAsync('setWord', [word, playerNumber, sessionStore.session.sessionCode])
  )
}

export const madeGuess = async (guess: string, results: string[]) => {
  const playerNumber = sessionStore.playerIsHost ? 1 : 2
  return await enqueue(() =>
    emitAsync('madeGuess', [
      guess,
      results,
      playerNumber,
      sessionStore.session.sessionCode,
    ])
  )
}

export const nextRound = async () => {
  return await enqueue(() =>
    emitAsync('nextRound', sessionStore.session.sessionCode)
  )
}

export const endGame = async () => {
  return await enqueue(() =>
    emitAsync('endGame', sessionStore.session.sessionCode)
  )
}

export const leaveRoom = async () => {
  sessionStore.playerIsHost = false
  return await enqueue(() =>
    emitAsync('leaveRoom', sessionStore.session.sessionCode)
  )
}
