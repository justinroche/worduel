import dictionary from '../resources/dictionary.json'

const dictionarySet = new Set(Object.keys(dictionary))

export const isWordInDictionary = (word: string) => {
  return dictionarySet.has(word.toLowerCase())
}
