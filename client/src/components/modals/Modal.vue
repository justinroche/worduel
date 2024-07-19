<script setup lang="ts">
const props = defineProps<{
  width: string
  height: string
}>()
</script>

<template>
  <div class="overlay">
    <div class="modal" :style="{ width: props.width, height: props.height }">
      <slot></slot>
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
  background-color: var(--floral-white);
  border: 1px solid #000;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
