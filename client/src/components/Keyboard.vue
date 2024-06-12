<script setup lang="ts">
const props = defineProps<{
  letters: string[][]
  letterLabels: string[][]
}>()
</script>

<template>
  <div v-for="(row, rowIndex) in props.letters" class="row">
    <div
      v-for="(letter, letterIndex) in row"
      :key="letter"
      class="letter"
      :class="props.letterLabels[rowIndex][letterIndex]"
    >
      {{ letter }}
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.letter {
  font-weight: 600;
  font-size: 24px;

  border-radius: 3px;
  box-sizing: border-box;

  height: 45px;
  width: 45px;
  margin: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.unused {
  background-color: #d3d6da;
  color: #1d1c1c;
}

.correct {
  background-color: #64b35d;
}

.misplaced {
  background-color: #d4bc51;
}

.incorrect {
  background-color: #787c7e;
}
</style>
