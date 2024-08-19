import dictionary from '../resources/dictionary.json'
import profanity from '../resources/profanity_five.txt?raw'

const dictionarySet = new Set(Object.keys(dictionary))

const profanitySet = new Set(
  profanity.split('\n').map((word) => word.trim().toLowerCase())
)

export const isWordInDictionary = (word: string) => {
  return dictionarySet.has(word.toLowerCase())
}

export const isWordProfanity = (word: string) => {
  return profanitySet.has(word.toLowerCase())
}
