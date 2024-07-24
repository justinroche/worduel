import mongoose from 'mongoose';

export interface Word {
  wordSetter: number;
  word: string;
  guesses?: string[];
  results?: string[][];
  guessingComplete?: boolean;
  guessedIn?: number;
}

export interface Game {
  id: number;
  state: 'setting word' | 'in play' | 'complete';
  words: Word[];
}

export interface Session extends mongoose.Document {
  sessionCode: string;
  player1Name: string;
  player2Name: string;
  player1UUID: string;
  player2UUID: string;
  player1SocketId: string;
  player2SocketId: string;
  player2Connected: boolean;
  rounds: number;
  spellCheckEnabled: boolean;
  blockProfanityEnabled: boolean;
  roundTimerEnabled: boolean;
  roundTimerDuration: number;
  state: 'in lobby' | 'in play' | 'complete';
  currentRound: number;
  games: Game[];
}

const wordSchema = new mongoose.Schema<Word>({
  wordSetter: { type: Number, required: true, enum: [1, 2] },
  word: { type: String, required: true },
  guesses: { type: [String], default: Array(6).fill('_____') },
  results: { type: [[String]], default: [] },
  guessingComplete: { type: Boolean, default: false },
  guessedIn: { type: Number },
});

const gameSchema = new mongoose.Schema<Game>({
  id: { type: Number, required: true, min: 0, max: 9 },
  state: {
    type: String,
    required: true,
    enum: ['setting word', 'in play', 'complete'],
  },
  words: { type: [wordSchema], default: [] },
});

const sessionSchema = new mongoose.Schema<Session>({
  sessionCode: { type: String, required: true, length: 5, unique: true },
  player1Name: { type: String, default: 'Player 1' },
  player2Name: { type: String, default: 'Player 2' },
  player1UUID: { type: String, default: '' },
  player2UUID: { type: String, default: '' },
  player1SocketId: { type: String, default: '' },
  player2SocketId: { type: String, default: '' },
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

const SessionModel = mongoose.model<Session>('Session', sessionSchema);

export default SessionModel;
