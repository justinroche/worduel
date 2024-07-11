<script setup lang="ts">
const wordleUrl = 'https://www.nytimes.com/games/wordle/index.html'
</script>

<template>
  <div>
    <h3>Welcome to Worduel!</h3>
    <p>
      This game works just like
      <a :href="wordleUrl" target="_blank" rel="noreferrer noopener">Wordle</a>,
      except you play head-to-head against a friend. Start by hosting a lobby,
      then share the code with your friend to join.
    </p>
    <p>
      You will each come up with words for your opponent to guess, Wordle-style.
      Scores are tallied over the course of multiple rounds. Good luck!
    </p>
  </div>
</template>

<style scoped>
a:link,
a:visited {
  color: #800080;
}
</style>
