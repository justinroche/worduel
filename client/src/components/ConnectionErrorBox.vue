<script setup lang="ts">
import { useConnectionStore } from '../stores/connection'
const connectionStore = useConnectionStore()
</script>

<template>
  <transition name="fade">
    <div v-if="!connectionStore.isConnected" class="box">
      <p>
        Failed to connect to the server. Please check your internet connection
        and try again.
      </p>
    </div>
  </transition>
</template>

<style scoped>
.box {
  color: white;
  background-color: rgb(41, 41, 41);
  padding: 1rem;
  border-radius: 0.25rem;
  width: 250px;
  font-size: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
