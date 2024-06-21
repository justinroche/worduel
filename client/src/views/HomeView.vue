<script setup lang="ts">
import { ref, watch } from 'vue'
import InfoBox from '../components/InfoBox.vue'

const wordleUrl = 'https://www.nytimes.com/games/wordle/index.html'
const githubUrl = 'https://github.com/justinroche/worduel'
const emailUrl = 'mailto:justinroche03@gmail.com'
const joinCode = ref('')
const showInfoBox = ref(false)
const showInfoContent = ref(false)
const showHelpContent = ref(false)

// Convert join code to uppercase
watch(joinCode, (newValue) => {
  joinCode.value = newValue.toUpperCase()
})

// Only allow alphanumeric characters in the join code input
const filterInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const filteredValue = input.value.replace(/[^a-zA-Z0-9]/g, '')
  joinCode.value = filteredValue
}

const handleHostButton = () => {
  console.log('Host button clicked')
}

const handleJoinButton = () => {
  console.log('Join button clicked')
}

const handleInfoButton = () => {
  if (showInfoContent.value) {
    // Closing info content
    showInfoBox.value = false
    showInfoContent.value = false
  } else if (showHelpContent.value) {
    // Switching from help to info content
    showHelpContent.value = false
    showInfoContent.value = true
  } else {
    // Opening info box
    showInfoBox.value = true
    showInfoContent.value = true
  }
}

const handleHelpButton = () => {
  if (showHelpContent.value) {
    // Closing help content
    showInfoBox.value = false
    showHelpContent.value = false
  } else if (showInfoContent.value) {
    // Switching from info to help content
    showInfoContent.value = false
    showHelpContent.value = true
  } else {
    // Opening help box
    showInfoBox.value = true
    showHelpContent.value = true
  }
}
</script>

<template>
  <div class="home-view">
    <div class="main-content">
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
          @input="filterInput"
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
    <div class="info-section">
      <transition name="info-box">
        <info-box v-if="showInfoBox" class="info-box">
          <div v-if="showInfoContent" class="info-content">
            <h3>Welcome to Worduel!</h3>
            <p>
              This game works just like
              <a :href="wordleUrl" target="_blank" rel="noreferrer noopener"
                >Wordle</a
              >, except you play head-to-head against a friend. Start by hosting
              a lobby, then share the code with your friend to join.
            </p>
            <p>
              You will each come up with words for your opponent to guess,
              Wordle-style. Scores are tallied over the course of multiple
              rounds. Good luck!
            </p>
          </div>
          <div v-if="showHelpContent" class="help-content">
            <p>
              <a :href="githubUrl" target="_blank" ref="noreferrer noopener"
                >GitHub Repository</a
              >
            </p>
            <p>
              Feel free to reach out with any questions or suggestions:
              <a :href="emailUrl" target="_blank" ref="noreferrer noopener"
                >justinroche03@gmail.com</a
              >
            </p>
          </div>
        </info-box>
      </transition>
      <div class="info-button-container">
        <button @click="handleInfoButton" class="info-button" tabindex="4">
          <font-awesome-icon :icon="['fas', 'circle-info']" size="2x" />
        </button>
        <button @click="handleHelpButton" class="help-button" tab-index="5">
          <font-awesome-icon :icon="['fas', 'circle-question']" size="2x" />
        </button>
      </div>
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
  padding-bottom: 15vh;
  box-sizing: border-box;
  position: relative;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 3rem;
}

.home-button {
  font-family: inherit;
  font-weight: 600;
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
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #3a3335;
  border-radius: 0.25rem;
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

.info-section {
  position: absolute;
  bottom: 10vh;
}

.info-button-container {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.info-button,
.help-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.info-button:hover .fa-circle-info,
.help-button:hover .fa-circle-question {
  color: #443b3d;
}

.info-box {
  transform: translateY(-10px);
  margin-bottom: 10px;
}

.info-box-enter-to {
  transition: opacity 0.5s ease, transform 0.3s ease;
}

.info-box-leave-to {
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.info-box-enter-from,
.info-box-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.info-box-enter-to,
.info-box-leave-from {
  opacity: 1;
  transform: translateY(-10px);
}

a:link,
a:visited {
  color: #800080;
}
</style>
