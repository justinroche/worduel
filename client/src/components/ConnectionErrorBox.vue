<script setup lang="ts">
import { useConnectionStore } from '../stores/connection'
const connectionStore = useConnectionStore()
</script>

<template>
  <transition name="fade">
    <div v-if="!connectionStore.isConnected" class="box">
      <font-awesome-icon :icon="['fas', 'triangle-exclamation']" size="3x" />
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
  padding: 1.5rem 1rem;
  border-radius: 0.25rem;
  width: 250px;
  font-size: 1rem;
}

.box p {
  margin: 1rem 0 0 0;
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
