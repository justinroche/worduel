<script setup lang="ts">
const props = defineProps<{
  letter: string
}>()
</script>

<template>
  <div class="card">
    {{ props.letter }}
  </div>
</template>

<style scoped>
.card {
  border: 3px solid #b6b6b6;
  border-radius: 5px;
  height: 60px;
  width: 60px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
