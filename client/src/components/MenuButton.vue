<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    buttonText: string
    fontSize: string
    buttonWidth: string
    buttonHeight: string
    buttonStyle: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)
</script>

<template>
  <button
    :class="['menu-button', props.buttonStyle]"
    :style="{
      width: `${props.buttonWidth}`,
      height: `${props.buttonHeight}`,
      fontSize: `${props.fontSize}`,
    }"
    :disabled="props.disabled"
  >
    {{ buttonText }}
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
}

.menu-button:disabled {
  background-color: #ccc;
  color: #666;
  border: 0px;
  cursor: default;
  opacity: 0.6;
}

.atomic-tangerine:not(:disabled) {
  background-color: var(--atomic-tangerine-default);
  border: 1px solid var(--atomic-tangerine-light);
}

.atomic-tangerine:not(:disabled):hover {
  background-color: var(--atomic-tangerine-light);
  border: 2px solid var(--atomic-tangerine-hover-border);
}

.atomic-tangerine:not(:disabled):active {
  background-color: var(--atomic-tangerine-active);
  border: 1px solid white;
}

.taupe:not(:disabled) {
  background-color: var(--taupe-default);
  border: 1px solid var(--taupe-light);
}

.taupe:not(:disabled):hover {
  background-color: var(--taupe-light);
  border: 2px solid var(--taupe-hover-border);
}

.taupe:not(:disabled):active {
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
