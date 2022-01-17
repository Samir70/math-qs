<script setup>
import { store } from "../store";
import { getMathsQs } from 'math-q-factory';
import { ShortAnswerQ, MultipleChoiceQ, SortQ } from "q-show";
import { ref, onMounted, nextTick } from 'vue';
const qTypes = {
  // classify: ClassifyQ,
  // match: MatchQ,
  multiChoice: MultipleChoiceQ,
  shortAnswer: ShortAnswerQ,
  sort: SortQ
}
const currentQ = ref(getMathsQs(...store.state.chosenQs[0]));
const qNumber = ref(0);
const qKey = ref(0);
const qHints = ref([]);
const waitForNext = ref(false);

const respondToAns = (ans) => {
  console.log('Need to respond to answer:', ans);
  if (ans.userWasCorrect) {
    console.log('userwascorrect path:', ...store.state.chosenQs[qNumber.value])
    store.commit('updateChapterProgress', [...store.state.chosenQs[qNumber.value]])
    // userProgress.value[chosenChapter.value] = Math.max(qNumber.value + 1, (userProgress.value[chosenChapter.value] || 0))
    qNumber.value = (qNumber.value + 1) % store.state.chosenQs.length
  }
  qHints.value = [`${currentQ.value.qFeedback || currentQ.value.a}`, ...qHints.value]
  waitForNext.value = true;
  //   console.log({ userProg: userProgress.value })
  nextTick(() => MathJax.typeset())
}
const nextQ = () => {
  currentQ.value = getMathsQs(...store.state.chosenQs[qNumber.value])
  qHints.value = []
  qKey.value++
  waitForNext.value = false;
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
    <component
      v-bind:is="qTypes[currentQ.qType]"
      v-bind:qData="currentQ"
      v-bind:key="qKey"
      v-on:user-answered="respondToAns"
      class="showq-qblock"
    />
    <button v-if="waitForNext" v-on:click="nextQ">Next Q</button>
    <div v-for="hint of qHints" class="showq-hint-box">
      <p>{{ hint }}</p>
    </div>
    <div id="showq-options-box">
      <button
        v-if="qHints.length < currentQ.hints.length"
        v-on:click="showHint"
      >{{ qHints.length === 0 ? 'Show Hint' : 'Show another hint' }}</button>
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