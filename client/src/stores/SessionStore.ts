import { defineStore } from 'pinia'
import { Session } from '../types/Session'

export const useSessionStore = defineStore('session', {
  state: () => ({
    session: {} as Session,
    playerIsHost: false,
    MAX_ROUNDS: 5,
  }),

  getters: {
    getSessionCode: (state) => state.session.sessionCode,
    getPlayer1Name: (state) => state.session.player1Name,
    getPlayer2Name: (state) => state.session.player2Name,
    getPlayer1UUID: (state) => state.session.player1UUID,
    getPlayer2UUID: (state) => state.session.player2UUID,
    getPlayer2Connected: (state) => state.session.player2Connected,
    getPlayerIsHost: (state) => state.playerIsHost,
    getRounds: (state) => state.session.rounds,
    getMaxRounds: (state) => state.MAX_ROUNDS,
    getSpellCheckEnabled: (state) => state.session.spellCheckEnabled,
    getBlockProfanityEnabled: (state) => state.session.blockProfanityEnabled,
    getRoundTimerEnabled: (state) => state.session.roundTimerEnabled,
    getRoundTimerDuration: (state) => state.session.roundTimerDuration,
    getRoundTimerDurationFormatted: (state) => {
      const minutes = Math.floor(state.session.roundTimerDuration / 60)
      const seconds = state.session.roundTimerDuration % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
    getState: (state) => state.session.state,
    getCurrentRound: (state) => state.session.currentRound,
    getGames: (state) => state.session.games,
  },
})
