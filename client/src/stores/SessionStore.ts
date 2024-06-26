import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessionCode: 'ABCD',

    player1Name: 'Player 1',
    player2Name: 'Player 2',
    playerIsHost: false,

    rounds: 3,
    MAX_ROUNDS: 10,
    spellCheckEnabled: true,
    blockProfanityEnabled: false,
    roundTimerEnabled: true,
    roundTimerDuration: 120,
  }),

  getters: {
    getSessionCode: (state) => state.sessionCode,
    getPlayer1Name: (state) => state.player1Name,
    getPlayer2Name: (state) => state.player2Name,
    getPlayerIsHost: (state) => state.playerIsHost,
    getRounds: (state) => state.rounds,
    getMaxRounds: (state) => state.MAX_ROUNDS,
    getSpellCheckEnabled: (state) => state.spellCheckEnabled,
    getBlockProfanityEnabled: (state) => state.blockProfanityEnabled,
    getRoundTimerEnabled: (state) => state.roundTimerEnabled,
    getRoundTimerDuration: (state) => state.roundTimerDuration,
    getRoundTimerDurationFormatted: (state) => {
      const minutes = Math.floor(state.roundTimerDuration / 60)
      const seconds = state.roundTimerDuration % 60
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
  },

  actions: {
    setSessionCode(sessionCode: string) {
      this.sessionCode = sessionCode
    },
    setPlayer1Name(player1Name: string) {
      this.player1Name = player1Name
    },
    setPlayer2Name(player2Name: string) {
      this.player2Name = player2Name
    },
    setPlayerIsHost(playerIsHost: boolean) {
      this.playerIsHost = playerIsHost
    },
    setRounds(rounds: number) {
      this.rounds = rounds
    },
    setSpellCheckEnabled(spellCheckEnabled: boolean) {
      this.spellCheckEnabled = spellCheckEnabled
    },
    setBlockProfanityEnabled(blockProfanityEnabled: boolean) {
      this.blockProfanityEnabled = blockProfanityEnabled
    },
    setRoundTimerEnabled(roundTimerEnabled: boolean) {
      this.roundTimerEnabled = roundTimerEnabled
    },
    setRoundTimerDuration(roundTimerDuration: number) {
      this.roundTimerDuration = roundTimerDuration
    },
  },
})
