export type Word = {
  wordSetter: 1 | 2
  word: string
  guesses: string[]
  successfullyGuessed: boolean
  guessedIn?: number
}
