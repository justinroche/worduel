<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  letter: string
  result: string
  scale: number
}>()

const cardSize = computed(() => {
  return `${props.scale * 20}px`
})

const fontSize = computed(() => `${props.scale * 10 + 6}px`)
const cellMargin = computed(() => `${props.scale * 2 - 1}px`)
</script>

<template>
  <div
    class="card"
    :class="props.result"
    :style="{ height: cardSize, width: cardSize, fontSize, margin: cellMargin }"
  >
    {{ props.letter !== '_' ? props.letter : '' }}
  </div>
</template>

<style scoped>
.card {
  font-weight: 600;
  color: #fff;

  border-radius: 3px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  border: 3px solid var(--empty-cell-border);
  color: #1d1c1c;
}

.correct {
  background-color: var(--correct-cell);
}

.misplaced {
  background-color: var(--misplaced-cell);
}

.incorrect {
  background-color: var(--incorrect-cell);
}
</style>
