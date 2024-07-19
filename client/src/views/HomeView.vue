<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '../router'
import InfoBox from '../components/boxes/InfoBox.vue'
import HelpBoxContent from '../components/boxes/HelpBoxContent.vue'
import InfoBoxContent from '../components/boxes/InfoBoxContent.vue'
import MenuButton from '../components/MenuButton.vue'
import ConnectionErrorBox from '../components/boxes/ConnectionErrorBox.vue'
import HomeErrorBox from '../components/boxes/HomeErrorBox.vue'
import { createSession, joinSession } from '../clients/SessionClient'
import { useHomeErrorStore } from '../stores/HomeErrorStore'

const joinCode = ref('')
const showInfoBox = ref(false)
const showInfoContent = ref(false)
const showHelpContent = ref(false)
const hostButtonLoading = ref(false)
const joinButtonLoading = ref(false)

const homeErrorStore = useHomeErrorStore()

// Convert game code to uppercase
watch(joinCode, (newValue) => {
  joinCode.value = newValue.toUpperCase()
})

const handleJoinCodeInput = (event: Event) => {
  // Only allow alphanumeric characters in the game code input
  const input = event.target as HTMLInputElement
  const filteredValue = input.value.replace(/[^a-zA-Z0-9]/g, '')
  joinCode.value = filteredValue

  // Submit on enter pressed
  if ((event as KeyboardEvent).key === 'Enter') {
    handleJoinButton()
  }
}

const handleHostButton = async () => {
  hostButtonLoading.value = true
  try {
    await createSession()
    router.push({ name: 'lobby' })
  } catch (error) {
    console.error('Error creating session:', error)
    homeErrorStore.setError('Failed to create session.')
  } finally {
    hostButtonLoading.value = false
  }
}

const handleJoinButton = async () => {
  if (joinCode.value.length === 0) {
    homeErrorStore.setError('Please enter a game code.')
    return
  }
  if (joinCode.value.length !== 5) {
    homeErrorStore.setError('Game code must be 5 characters.')
    return
  }
  joinButtonLoading.value = true
  try {
    await joinSession(joinCode.value)
    router.push({ name: 'lobby' })
  } catch (error) {
    console.error('Error joining session:', error)
    homeErrorStore.setError(
      'Failed to join session. Please check the code and try again.'
    )
  } finally {
    joinButtonLoading.value = false
  }
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
      <menu-button
        buttonText="Host"
        fontSize="1rem"
        buttonWidth="250px"
        buttonHeight="40px"
        buttonStyle="primary"
        @click="handleHostButton"
        :loading="hostButtonLoading"
        class="host-button"
        tabindex="1"
      />
      <div class="join-container">
        <input
          type="text"
          class="join-code-input"
          :class="{ 'join-code-input-spacing': joinCode.length > 0 }"
          v-model="joinCode"
          @input="handleJoinCodeInput"
          @keydown="handleJoinCodeInput"
          placeholder="Enter code..."
          maxlength="5"
          tabindex="2"
        />
        <menu-button
          buttonText="Join"
          fontSize="1rem"
          buttonWidth="120px"
          buttonHeight="40px"
          buttonStyle="primary"
          @click="handleJoinButton"
          :loading="joinButtonLoading"
          tabindex="3"
        />
      </div>
      <div class="error-box-container">
        <home-error-box />
      </div>
    </div>
    <div class="info-section">
      <transition name="info-box">
        <info-box v-if="showInfoBox" class="info-box">
          <info-box-content v-if="showInfoContent" />
          <help-box-content v-if="showHelpContent" />
        </info-box>
      </transition>
      <div class="info-button-container">
        <button @click="handleInfoButton" class="info-button" tabindex="4">
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            style="color: black"
            size="2x"
          />
        </button>
        <button @click="handleHelpButton" class="help-button" tab-index="5">
          <font-awesome-icon
            :icon="['fas', 'circle-question']"
            style="color: black"
            size="2x"
          />
        </button>
      </div>
    </div>
  </div>
  <div class="connection-error-box-container">
    <connection-error-box />
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

.host-button {
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
  border: 1px solid var(--taupe-default);
  border-radius: 0.25rem;
  width: 120px;
  margin-right: 10px;
  box-sizing: border-box;
}

.join-code-input-spacing {
  letter-spacing: 0.2rem;
}

.error-box-container {
  height: 40px;
  display: flex;
  align-items: flex-start;
}

.info-section {
  position: absolute;
  bottom: 5vh;
}

.info-button-container {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.connection-error-box-container {
  position: absolute;
  bottom: 5vh;
  right: 5vh;
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
</style>
