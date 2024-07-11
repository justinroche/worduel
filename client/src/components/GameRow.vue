<script setup lang="ts">
import GameCell from './GameCell.vue'

const props = defineProps<{
  guess: string[]
  results: string[]
  scale: number
}>()
</script>

<template>
  <div class="row">
    <game-cell
      v-for="(letter, index) in props.guess"
      :key="index"
      :letter="letter"
      :result="results[index] ? results[index] : 'empty'"
      :scale="props.scale"
    />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
</style>
