<script setup lang="ts">
import { useHomeErrorStore } from '../stores/HomeErrorStore'
import { computed } from 'vue'

const homeErrorStore = useHomeErrorStore()
const message = computed(() => homeErrorStore.message)
const showMessage = computed(() => homeErrorStore.showMessage)
</script>

<template>
  <transition name="fade">
    <div v-show="showMessage" class="error-box">
      {{ message }}
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
