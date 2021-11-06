<script setup>
import { shortAnswerPaths } from 'math-q-factory';
import ChapterCard from './components/ChapterCard.vue';
console.log(shortAnswerPaths)
let chapterSet = new Set(Object.keys(shortAnswerPaths))
console.log(chapterSet)
// const chapterSet = computed(() => {

// })
</script>

<template>
  <div>
    <h1>Maths - Qs</h1>
    <div class="card-list">
      <ChapterCard
        v-for="chapter in chapterSet"
        v-bind:title="chapter"
        v-bind:contents="shortAnswerPaths[chapter]"
      />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
