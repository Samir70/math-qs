<script setup>
import { shortAnswerPaths, totalQs, topicsToTest, getMathsQs } from 'math-q-factory';
import { ShortAnswerQ } from "q-show";
import { ref } from 'vue';
import ChapterCard from './components/ChapterCard.vue';
import { worksheets } from './assets/worksheets';
// console.log(shortAnswerPaths)
let chapterSet = new Set(Object.keys(shortAnswerPaths))
console.log(chapterSet)
const chosenChapter = ref('');
const qPathList = ref([]);
const qNumber = ref(0);
const qKey = ref(0);
const currentQ = ref({});
const qHint = ref([0, '']);
const userProgress = ref({});
const toShow = ref('options')
const waitForNext = ref(false);
const setLearnChapter = (title) => {
  console.log('user wants to learn', title)
  toShow.value = 'question'
  chosenChapter.value = title
  if (userProgress.value[title] === undefined) { userProgress.value[title] = 0 }
  qNumber.value = userProgress.value[title]
  qPathList.value = topicsToTest.filter(t => t[0] === title)
  currentQ.value = getMathsQs(...qPathList.value[qNumber.value])
  qHint.value = [0, '']
  console.log(currentQ.value);
}
const respondToAns = (ans) => {
  console.log('Need to respond to answer:', ans);
  if (ans.userWasCorrect) {
    userProgress.value[chosenChapter.value] = Math.max(qNumber.value + 1, (userProgress.value[chosenChapter.value] || 0))
    qNumber.value = (qNumber.value + 1) % qPathList.value.length
  } else {
    qHint.value = [0, `Answer:   ${currentQ.value.qFeedback || currentQ.value.a}`]
  }
  waitForNext.value = true;
  console.log({ userProg: userProgress.value })
}
const nextQ = () => {
  currentQ.value = getMathsQs(...qPathList.value[qNumber.value])
  qHint.value = [0, '']
  qKey.value++
  waitForNext.value = false;
}
const chosenWorkSheet = ({})
const workSheetQs = ref([])
const showAnswers = ref(false);
const chooseWorkSheet = (ws) => {
  console.log('user wants to do worksheet:', ws.name)
  chosenWorkSheet.value = ws
  showAnswers.value = false;
  workSheetQs.value = ws.topicList.map(q => getMathsQs(...q.split('-')))
  toShow.value = 'worksheet'
  // get ready in case user wants to display as quiz
  chosenChapter.value = ws.name;
  if (userProgress.value[ws.name] === undefined) { userProgress.value[ws.name] = 0 }
  qNumber.value = userProgress.value[ws.name]
  qPathList.value = ws.topicList.map(t => t.split('-'))
  currentQ.value = getMathsQs(...qPathList.value[qNumber.value])
  qHint.value = [0, '']
  console.log(currentQ.value);
}
const copyWS = () => {
  navigator.clipboard.writeText(qPathList.value.join('\n\n'))
}
const showHint = () => {
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
    <button v-if="toShow === 'options'" v-on:click="toShow = 'worksheets'">Choose a worksheet</button>
    <div v-if="toShow === 'worksheets'" id="worksheet-list">
      <p
        v-for="ws of worksheets"
        class="worksheet-title"
        v-on:click="chooseWorkSheet(ws)"
      >{{ ws.name }}</p>
      <button v-on:click="toShow = 'options'">Back to course list</button>
    </div>
    <div v-if="toShow === 'worksheet'" id="ws-box">
      <button v-on:click="toShow = 'worksheets'">Back to choose a worksheet</button>
      <button v-on:click="copyWS">Copy to clipboard</button>
      <button v-on:click="chooseWorkSheet(chosenWorkSheet.value)">Change all qs</button>
      <button v-on:click="showAnswers = !showAnswers">Show answers</button>
      <button v-on:click="toShow = 'question'">Show as quiz</button>
      <div id="worksheet">
        <h2>{{chosenWorkSheet.value.name}}</h2>
        <div v-for="q of workSheetQs">
          <p>{{ q.q }} <span v-if="showAnswers" class="answer">....{{q.a}}</span></p>
          <br />
        </div>
      </div>
    </div>
    <div v-if="toShow === 'options'" class="card-list">
      <ChapterCard
        v-for="chapter in chapterSet"
        v-bind:title="chapter"
        v-bind:contents="shortAnswerPaths[chapter]"
        v-bind:completedQs="userProgress[chapter] || 0"
        v-bind:totalQs="totalQs[chapter] || 0"
        v-on:click="setLearnChapter(chapter)"
      />
    </div>
    <div v-if="toShow === 'question'">
      <component
        v-bind:is="qTypes[currentQ.qType]"
        v-bind:qData="currentQ"
        v-bind:key="qKey"
        v-on:user-answered="respondToAns"
      />
      <button v-if="waitForNext" v-on:click="nextQ">Next Q</button>
      <div v-if="qHint[1] !== ''">
        <p>{{ qHint[1] }}</p>
      </div>
      <div id="options-box">
        <button v-on:click="toShow = 'options'">Back to course list</button>
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
  white-space: pre-wrap;
}
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.answer {
  color: red;
}
#options-box {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
.worksheet-title {
  text-decoration: underline;
}
.worksheet-title:hover {
  background: violet;
}
#worksheet {
  background: whitesmoke;
  text-align: left;
}
</style>
