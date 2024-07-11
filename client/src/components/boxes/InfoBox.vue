<script setup lang="ts"></script>

<template>
  <div class="info-box">
    <div class="info-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.info-box {
  background-color: #fff;
  border: 1px solid #3a3335;
  border-radius: 0.25rem;
  padding: 1rem;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-box-content {
  font-size: 1rem;
  color: #000000;
}
</style>
