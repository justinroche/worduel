<script setup lang="ts">
import OpponentsTable from '../OpponentsTable.vue'
import { useGameBoxesStore } from '../../stores/GameBoxesStore'

const gameBoxesStore = useGameBoxesStore()
</script>

<template>
  <div class="desktopOpponentsTableBox">
    <h3>Opponent's Guesses</h3>
    <div class="icon-wrapper">
      <button
        @click="gameBoxesStore.handleToggleOpponentsGuesses"
        class="icon-button"
      >
        <font-awesome-icon
          :icon="['fas', 'chevron-right']"
          size="2xl"
          class="fa-icon"
        />
      </button>
    </div>
    <opponents-table />
  </div>
</template>

<style scoped>
.desktopOpponentsTableBox {
  background-color: var(--floral-white);
  border: 1px solid black;
  border-radius: 0.25rem;
  padding: 1rem;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease;
}

.icon-wrapper {
  position: fixed;
  top: 1.05rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.fa-icon {
  color: black;
  transition: color 0.1s ease;
}

.fa-icon:hover {
  color: #414d40;
}

h3 {
  margin: 0 0 1rem 0;
}
</style>
