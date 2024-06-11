<script setup lang="ts">
const props = defineProps<{
  letter: string
  result: string
}>()

if (props.result) {
  console.log(props.result)
}
</script>

<template>
  <div class="card" :class="props.result">
    {{ props.letter }}
  </div>
</template>

<style scoped>
.card {
  font-weight: 600;
  border: 3px solid #b6b6b6;
  border-radius: 5px;
  box-sizing: border-box;
  height: 60px;
  width: 60px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.correct {
  background-color: #64b35d;
  border: 0px;
}

.misplaced {
  background-color: #d4bc51;
  border: 0px;
}

.incorrect {
  background-color: #787c7e;
  border: 0px;
}
</style>
