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
</script>

<template>
  <div
    class="card"
    :class="props.result"
    :style="{ height: cardSize, width: cardSize }"
  >
    {{ props.letter }}
  </div>
</template>

<style scoped>
.card {
  font-weight: 600;
  font-size: 32px;
  color: #fff;

  border-radius: 3px;
  box-sizing: border-box;

  margin: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  border: 3px solid #b6b6b6;
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
