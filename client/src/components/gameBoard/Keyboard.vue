<script setup lang="ts">
const props = defineProps<{
  letters: string[][]
  letterLabels: string[][]
}>()

const emit = defineEmits(['key-event'])

function emitKeyEvent(key: string, event: Event) {
  ;(event.target as HTMLElement).blur()
  emit('key-event', key)
}
</script>

<!-- TODO: use touchstart (rather than click) for mobile interface -->
<template>
  <div v-for="(row, rowIndex) in props.letters" class="row">
    <button
      v-for="(letter, letterIndex) in row"
      :key="letter"
      class="letter"
      :class="props.letterLabels[rowIndex][letterIndex]"
      @click="(event) => emitKeyEvent(letter, event)"
    >
      {{ letter }}
    </button>
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
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 24px;

  border: 0;
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
  background-color: #55be4c;
}

.misplaced {
  background-color: #f0d354;
}

.incorrect {
  background-color: #787c7e;
}
</style>
