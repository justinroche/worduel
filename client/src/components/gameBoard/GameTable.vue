<script setup lang="ts">
import GameRow from './GameRow.vue'

const props = withDefaults(
  defineProps<{
    guesses: string[][]
    results: string[][]
    scale: number
  }>(),
  {
    scale: 3,
  }
)
</script>

<template>
  <div>
    <game-row
      v-for="(guess, index) in props.guesses"
      :key="index"
      :guess="guess"
      :results="props.results[index] ? props.results[index] : []"
      :scale="props.scale"
    />
  </div>
</template>

<style scoped></style>
