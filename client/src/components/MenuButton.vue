<script setup lang="ts">
const props = defineProps<{
  buttonText: string
  fontSize: string
  buttonWidth: string
  buttonHeight: string
  buttonStyle: string
}>()
</script>

<template>
  <button
    :class="['menu-button', props.buttonStyle]"
    :style="{
      width: `${props.buttonWidth}`,
      height: `${props.buttonHeight}`,
      fontSize: `${props.fontSize}`,
    }"
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

.atomic-tangerine {
  background-color: var(--atomic-tangerine-default);
  border: 1px solid var(--atomic-tangerine-light);
}

.atomic-tangerine:hover {
  background-color: var(--atomic-tangerine-light);
  border: 2px solid var(--atomic-tangerine-hover-border);
}

.atomic-tangerine:active {
  background-color: var(--atomic-tangerine-active);
  border: 1px solid white;
}

.taupe {
  background-color: var(--taupe-default);
  border: 1px solid var(--taupe-light);
}

.taupe:hover {
  background-color: var(--taupe-light);
  border: 2px solid var(--taupe-hover-border);
}

.taupe:active {
  background-color: var(--taupe-active);
  border: 1px solid white;
}

.auburn {
  background-color: var(--auburn-default);
  border: 1px solid var(--auburn-light);
}

.auburn:hover {
  background-color: var(--auburn-light);
  border: 2px solid var(--auburn-hover-border);
}

.auburn:active {
  background-color: var(--auburn-active);
  border: 1px solid white;
}
</style>
