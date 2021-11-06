<script setup>
import { shortAnswerPaths } from 'math-q-factory';
import CourseCard from './components/CourseCard.vue';
console.log(shortAnswerPaths)
let chapterSet = new Set(Object.keys(shortAnswerPaths))
console.log(chapterSet)
// const chapterSet = computed(() => {

// })
</script>

<template>
<div>
  <CourseCard v-for="chapter in chapterSet" v-bind:title="chapter" v-bind:contents="shortAnswerPaths[chapter]" />
</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
