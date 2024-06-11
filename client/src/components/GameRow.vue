<script setup lang="ts">
import { ref, watch } from 'vue'
import GameCell from './GameCell.vue'

const props = defineProps<{
  currentGuess: {
    row: number
    letters: string[]
  }
  results: string[]
  guessNumber: number
}>()

const guess = ref(['', '', '', '', ''])

watch(
  () => props.currentGuess,
  (newGuess) => {
    if (props.guessNumber === newGuess.row) {
      guess.value = newGuess.letters
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="row">
    <game-cell
      v-for="(letter, index) in guess"
      :key="index"
      :letter="letter"
      :result="results[index] ? results[index] : 'empty'"
    />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
</style>
