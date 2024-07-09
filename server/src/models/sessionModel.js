const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  wordSetter: { type: Number, required: true, enum: [1, 2] },
  word: { type: String, required: true },
  guesses: { type: [String], default: [] },
  successfullyGuessed: { type: Boolean, default: false },
  guessedIn: { type: Number },
});

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, min: 0, max: 9 },
  state: {
    type: String,
    required: true,
    enum: ['setting word', 'in play', 'complete'],
  },
  words: { type: [wordSchema], default: [] },
});

const sessionSchema = new mongoose.Schema({
  sessionCode: { type: String, required: true, length: 5, unique: true },
  player1Name: { type: String, default: 'Player 1' },
  player2Name: { type: String, default: 'Player 2' },
  player2Connected: { type: Boolean, default: false },
  rounds: { type: Number, default: 3 },
  spellCheckEnabled: { type: Boolean, default: true },
  blockProfanityEnabled: { type: Boolean, default: false },
  roundTimerEnabled: { type: Boolean, default: false },
  roundTimerDuration: { type: Number, default: 120 },
  state: {
    type: String,
    enum: ['in lobby', 'in play', 'complete'],
    default: 'in lobby',
  },
  currentRound: { type: Number, default: 0 },
  games: { type: [gameSchema], default: [] },
});

module.exports = mongoose.model('Session', sessionSchema);
