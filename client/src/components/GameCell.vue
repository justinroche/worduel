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
  font-size: 28px;
  color: #fff;

  border-radius: 3px;
  box-sizing: border-box;

  height: 60px;
  width: 60px;
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
  background-color: #64b35d;
}

.misplaced {
  background-color: #d4bc51;
}

.incorrect {
  background-color: #787c7e;
}
</style>
