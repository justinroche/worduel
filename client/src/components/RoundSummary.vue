<script setup lang="ts">
import { computed } from 'vue'
import ResultTables from './ResultTables.vue'

const props = defineProps({
  round: Number,
  openRound: Number,
})

const emits = defineEmits(['update:openRound'])

const isOpen = computed(() => props.openRound === props.round)

const toggleOpen = () => {
  if (isOpen.value) {
    emits('update:openRound', -1)
  } else {
    emits('update:openRound', props.round)
  }
}
</script>

<template>
  <div class="round-summary">
    <button @click="toggleOpen" class="round-button">
      <span>Round {{ round! }}</span>
      <div class="icon-wrapper">
        <font-awesome-icon
          :icon="['fas', 'caret-right']"
          size="lg"
          :class="{ rotate: isOpen }"
          class="fa-icon"
        />
      </div>
    </button>
    <transition name="slide-fade">
      <div v-if="isOpen" class="game-tables">
        <result-tables :round="round" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.round-summary {
  width: 600px;
  position: relative;
}

.round-button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  background-color: var(--floral-white);
  padding: 5px 10px;
  box-sizing: border-box;
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: border 0.05s;
  z-index: 2;
  position: relative;
}

.round-summary button:hover {
  border: 1px solid black;
}

.icon-wrapper {
  display: flex;
  align-items: center;
}

.icon-wrapper .fa-icon {
  transition: transform 0.3s ease;
}

.icon-wrapper .fa-icon.rotate {
  transform: rotate(90deg);
}

.game-tables {
  background-color: var(--floral-white);
  padding: 0 10px;
  justify-content: space-between;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px; /* Adjust as needed */
  opacity: 1;
  transform: translateY(0);
}
</style>
