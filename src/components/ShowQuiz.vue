<script setup>
import { store } from "../store";
import { getMathsQs } from 'math-q-factory';
import { ref, onMounted, nextTick } from 'vue';
import { emitActions } from '../helperFuncs/globalConsts';
import ShowQuestion from "./ShowQuestion.vue";
const emits = defineEmits(emitActions)

const qList = store.state.chosenWorksheet.topicList.map(t => t.split('-'));
const currentQ = ref(getMathsQs(...qList[0]));
const qNumber = ref(0);
const qKey = ref(0);
const qHints = ref([]);
const waitForNext = ref(false);

const quizResponse = (correctness) => {
  if (correctness) {
    console.log('userwascorrect path:', qList[qNumber.value])
    qNumber.value = (qNumber.value + 1) % qList.length
  }
  qHints.value = [`${currentQ.value.qFeedback || currentQ.value.a}`, ...qHints.value]
  waitForNext.value = true;
  nextTick(() => MathJax.typeset())
}
const nextQ = () => {
  currentQ.value = getMathsQs(...qList[qNumber.value])
  qHints.value = []
  qKey.value++
  waitForNext.value = false;
  nextTick(() => MathJax.typeset())
}
const showHint = () => {
  qHints.value = currentQ.value.hints.slice(0, qHints.value.length + 1)
}
onMounted(() => {
  MathJax.typeset()
})
</script>

<template>
  <div id="question-box">
    <ShowQuestion v-bind:currentQ="currentQ" v-bind:qKey="qKey" v-on:q-finished="quizResponse"/>
    <button v-if="waitForNext" v-on:click="nextQ">Next Q</button>
    <div v-for="hint of qHints" class="showq-hint-box">
      <p>{{ hint }}</p>
    </div>
    <div id="showq-options-box">
      <button v-if="qHints.length < currentQ.hints.length" v-on:click="showHint">{{ qHints.length === 0 ? 'Show Hint' :
          'Show another hint'
      }}</button>
    </div>
  </div>
</template>

<style>
#showq-options-box {
  display: flex;
  justify-content: space-around;
  margin: auto;
}

.showq-hint-box {
  border: 1px solid blue;
  padding: 3px;
  width: 90vw;
  max-width: 480px;
  margin: auto;
}

.showq-qblock {
  margin: auto;
}
</style>