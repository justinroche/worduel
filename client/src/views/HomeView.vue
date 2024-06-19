<script setup lang="ts">
import { ref, watch } from 'vue'

const joinCode = ref('')

watch(joinCode, (newValue) => {
  joinCode.value = newValue.toUpperCase()
})

const handleHostButton = () => {
  console.log('Host button clicked')
}

const handleJoinButton = () => {
  console.log('Join button clicked')
}
</script>

<template>
  <div class="home-view">
    <h1>Worduel</h1>
    <button
      @click="handleHostButton"
      class="home-button host-button"
      tabindex="1"
    >
      Host
    </button>
    <div class="join-container">
      <input
        type="text"
        class="join-code-input"
        :class="{ 'join-code-input-spacing': joinCode.length > 0 }"
        v-model="joinCode"
        placeholder="Enter code..."
        maxlength="4"
        tabindex="2"
      />
      <button
        @click="handleJoinButton"
        class="home-button join-button"
        tabindex="3"
      >
        Join
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 10vh;
  box-sizing: border-box;
}

h1 {
  font-size: 3rem;
}

.home-button {
  background-color: #3a3335;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  height: 40px;
  transition: background-color 0.05s ease-in-out;
}

.home-button:hover {
  background-color: #443b3d;
}

.home-button:active {
  background-color: #504346;
}

.host-button {
  width: 250px;
  margin-bottom: 10px;
}

.join-container {
  display: flex;
  justify-content: center;
  width: 250px;
  height: 40px;
}

.join-code-input {
  border: 1px solid #3a3335;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 1rem;
  width: 120px;
  margin-right: 10px;
  box-sizing: border-box;
}

.join-code-input-spacing {
  letter-spacing: 0.2rem;
}

.join-button {
  flex: 1;
}
</style>
