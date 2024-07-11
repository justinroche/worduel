<script setup lang="ts">
const githubUrl = 'https://github.com/justinroche/worduel'
const emailUrl = 'mailto:justinroche03@gmail.com'
</script>

<template>
  <div>
    <h3>About Worduel</h3>
    <p>Developed by Justin Roche</p>
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
</template>

<style scoped>
a:link,
a:visited {
  color: #800080;
}
</style>
