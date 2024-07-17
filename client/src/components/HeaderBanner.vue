<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="headerBanner">
    <h1>{{ props.title }}</h1>
  </div>
</template>

<style scoped>
.headerBanner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid black;

  display: flex;
  justify-content: center;
  align-items: center;
}

.headerBanner h1 {
  margin: 0;
}
</style>
