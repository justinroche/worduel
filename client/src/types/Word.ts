export type Word = {
  wordSetter: 1 | 2
  word: string
  guesses: string[]
  results: string[][]
  guessingComplete: boolean
  guessedIn?: number
}
