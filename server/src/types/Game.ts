import { Word } from './Word'

export type Game = {
  id: number
  state: 'setting word' | 'in play' | 'complete'
  words: Word[]
}
