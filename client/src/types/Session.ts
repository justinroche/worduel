import { Game } from './Game'

export type Session = {
  sessionCode: string
  player1Name: string
  player2Name: string
  player2Connected: boolean
  rounds: number
  spellCheckEnabled: boolean
  blockProfanityEnabled: boolean
  roundTimerEnabled: boolean
  roundTimerDuration: number
  state: 'in lobby' | 'in play' | 'complete'
  currentRound: number
  games: Game[]
}
