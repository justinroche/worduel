<script setup lang="ts">
const props = defineProps<{ message: string }>()
</script>

<template>
  <transition name="fade">
    <div v-show="props.message" class="error-box">
      {{ props.message }}
    </div>
  </transition>
</template>

<style scoped>
.error-box {
  color: white;
  background-color: rgb(41, 41, 41);
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
  font-size: 0.8rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
