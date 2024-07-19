<script setup lang="ts">
import OpponentsTable from '../OpponentsTable.vue'
import Modal from './Modal.vue'
</script>

<template>
  <modal width="350px" height="500px">
    <h2 class="congrats-message">Well Done!</h2>
    <p class="waiting-message">Waiting for opponent...</p>
    <opponents-table class="table" />
  </modal>
</template>

<style scoped>
.congrats-message {
  margin: 0;
}

.waiting-message {
  margin: 0.5rem 0 1.5rem 0;
}
</style>
