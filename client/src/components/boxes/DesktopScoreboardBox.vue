<script setup lang="ts">
import Scoreboard from '../Scoreboard.vue'
</script>

<template>
  <div class="desktopScoreboardBox">
    <h3>Scoreboard</h3>
    <scoreboard />
  </div>
</template>

<style scoped>
.desktopScoreboardBox {
  background-color: var(--floral-white);
  border: 1px solid black;
  border-radius: 0.25rem;
  padding: 1rem;
  width: 350px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease;
}

h3 {
  margin: 0 0 1rem 0;
}
</style>
