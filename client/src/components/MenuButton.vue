<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    buttonText: string
    fontSize: string
    buttonWidth: string
    buttonHeight: string
    buttonStyle: string
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
  }
)
</script>

<template>
  <button
    :class="['menu-button', props.buttonStyle, { loading: props.loading }]"
    :style="{
      width: `${props.buttonWidth}`,
      height: `${props.buttonHeight}`,
      fontSize: `${props.fontSize}`,
    }"
    :disabled="props.disabled || props.loading"
  >
    <template v-if="props.loading">
      <span class="loading-spinner"></span>
    </template>
    <template v-else>
      {{ buttonText }}
    </template>
  </button>
</template>

<style scoped>
.menu-button {
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.1s ease, border 0.1s ease;
  position: relative;
}

.menu-button:disabled,
.menu-button.loading {
  background-color: #ccc;
  color: #666;
  border: 0px;
  cursor: default;
  opacity: 0.6;
}

.menu-button.loading .loading-spinner {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1.5s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

.primary.loading .loading-spinner {
  border-top: 3px solid var(--green-default);
}

.taupe.loading .loading-spinner {
  border-top: 3px solid var(--taupe-default);
}

.auburn.loading .loading-spinner {
  border-top: 3px solid var(--auburn-default);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Existing styles for different button styles */
.primary:not(:disabled) {
  background-color: var(--green-default);
  border: 1px solid var(--green-light);
}

.primary:not(:disabled):hover {
  background-color: var(--green-light);
  border: 2px solid var(--green-hover-border);
}

.primary:not(:disabled):active {
  background-color: var(--green-active);
  border: 1px solid white;
}

.secondary:not(:disabled) {
  background-color: var(--taupe-default);
  border: 1px solid var(--taupe-light);
}

.secondary:not(:disabled):hover {
  background-color: var(--taupe-light);
  border: 2px solid var(--taupe-hover-border);
}

.secondary:not(:disabled):active {
  background-color: var(--taupe-active);
  border: 1px solid white;
}

.auburn:not(:disabled) {
  background-color: var(--auburn-default);
  border: 1px solid var(--auburn-light);
}

.auburn:not(:disabled):hover {
  background-color: var(--auburn-light);
  border: 2px solid var(--auburn-hover-border);
}

.auburn:not(:disabled):active {
  background-color: var(--auburn-active);
  border: 1px solid white;
}
</style>
