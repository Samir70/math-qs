<script setup>
import { shortAnswerPaths, totalQs, topicsToTest, getMathsQs } from 'math-q-factory';
import { ShortAnswerQ } from "q-show";
import { ref } from 'vue';
import ChapterCard from './components/ChapterCard.vue';
// console.log(shortAnswerPaths)
let chapterSet = new Set(Object.keys(shortAnswerPaths))
console.log(chapterSet)
const chosenChapter = ref('');
const qPathList = ref([]);
const qNumber = ref(0);
const currentQ = ref({});
const setReviewChapter = (title) => {
  console.log('user wants to review', title)
}
const setLearnChapter = (title) => {
  console.log('user wants to learn', title)
  chosenChapter.value = title
  qPathList.value = topicsToTest.filter(t => t[0] === title)
  currentQ.value = getMathsQs(...qPathList.value[0])
  console.log(currentQ.value);
}
const qHint = ref([0, '']);
const respondToAns = (ans) => {
  console.log('Need to respond to answer:', ans);
  qNumber.value = (qNumber.value + 1) % qPathList.value.length
  currentQ.value = getMathsQs(...qPathList.value[qNumber.value])
  qHint.value = [0, '']
}
const showHint = () => {
  console.log(currentQ.value)
  qHint.value = qHint.value[0] === 0 ? [1, currentQ.value.hint] : [2, currentQ.value.giveAway]
}
const qTypes = {
  // match: MatchQ,
  // multiChoice: MultipleChoiceQ,
  shortAnswer: ShortAnswerQ
}
</script>

<template>
  <div>
    <h1>Maths - Qs</h1>
    <div v-if="chosenChapter === ''" class="card-list">
      <ChapterCard
        v-for="chapter in chapterSet"
        v-bind:title="chapter"
        v-bind:contents="shortAnswerPaths[chapter]"
        v-bind:totalQs="totalQs[chapter] || 0"
        v-on:review-chapter="setReviewChapter"
        v-on:learn-chapter="setLearnChapter"
      />
    </div>
    <div v-else>
      <component
        v-bind:is="qTypes[currentQ.qType]"
        v-bind:qData="currentQ"
        v-bind:key="currentQ.qType + qNumber"
        v-on:user-answered="respondToAns"
      />
      <div v-if="qHint[0] > 0">
        <p>{{ qHint[1] }}</p>
      </div>
      <div id="options-box">
        <button v-on:click="chosenChapter = ''">Back to course list</button>
        <button
          v-if="qHint[0] < 2"
          v-on:click="showHint"
        >{{ qHint[0] === 0 ? 'Show Hint' : 'Show bigger hint' }}</button>
      </div>
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
#options-box {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
</style>
