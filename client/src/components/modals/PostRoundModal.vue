<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '../../stores/SessionStore'

const sessionStore = useSessionStore()

const currentRound = computed(() => sessionStore.getCurrentRound)
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h2>Round {{ currentRound }} Complete</h2>
      <div class="result-tables"></div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal {
  width: 700px;
  height: 900px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
}
</style>
