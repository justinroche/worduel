<script setup lang="ts">
import OpponentsTable from '../OpponentsTable.vue'
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal-content">
        <h2 class="congrats-message">Well Done!</h2>
        <p class="waiting-message">Waiting for opponent...</p>
        <opponents-table class="table" />
      </div>
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
  width: 350px;
  height: 500px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.congrats-message {
  margin: 0;
}

.waiting-message {
  margin: 0.5rem 0 1.5rem 0;
}
</style>
