<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '../router'
import InfoBox from '../components/InfoBox.vue'
import HelpBoxContent from '../components/HelpBoxContent.vue'
import InfoBoxContent from '../components/InfoBoxContent.vue'
import MenuButton from '../components/MenuButton.vue'
import { createSession, joinSession } from '../clients/SessionClient'

const joinCode = ref('')
const showInfoBox = ref(false)
const showInfoContent = ref(false)
const showHelpContent = ref(false)
const hostButtonLoading = ref(false)
const joinButtonLoading = ref(false)

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

const handleHostButton = async () => {
  hostButtonLoading.value = true
  try {
    await createSession()
    router.push({ name: 'lobby' })
  } catch (error) {
    console.error('Error creating session:', error)
    // TODO: Show error message
  } finally {
    hostButtonLoading.value = false
  }
}

const handleJoinButton = async () => {
  if (joinCode.value.length !== 4) {
    // TODO: Show error message
    return
  }
  joinButtonLoading.value = true
  try {
    await joinSession(joinCode.value)
    router.push({ name: 'lobby' })
  } catch (error) {
    console.error('Error joining session:', error)
    // TODO: Show error message
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
        buttonStyle="atomic-tangerine"
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
          @input="filterInput"
          placeholder="Enter code..."
          maxlength="4"
          tabindex="2"
        />
        <menu-button
          buttonText="Join"
          fontSize="1rem"
          buttonWidth="120px"
          buttonHeight="40px"
          buttonStyle="atomic-tangerine"
          @click="handleJoinButton"
          :loading="joinButtonLoading"
          tabindex="3"
        />
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
</style>
