<script setup lang="ts">
import GameRow from './GameRow.vue'

const props = defineProps<{
  currentGuess: {
    row: number
    letters: string[]
  }
  results: string[][]
}>()
</script>

<template>
  <div>
    <game-row
      v-for="row in 6"
      :key="row - 1"
      :currentGuess="props.currentGuess"
      :guessNumber="row - 1"
      :results="props.results[row - 1] ? props.results[row - 1] : []"
    />
  </div>
</template>

<style scoped></style>
