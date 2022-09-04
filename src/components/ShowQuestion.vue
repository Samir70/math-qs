<script setup>
import { store } from '../store';
import { ShortAnswerQ, MultipleChoiceQ, SortQ } from "q-show";

const props = defineProps({
    currentQ: Object,
    qKey: Number
})
const emits = defineEmits(['q-finished'])

const qTypes = {
  // classify: ClassifyQ,
  // match: MatchQ,
  multiChoice: MultipleChoiceQ,
  shortAnswer: ShortAnswerQ,
  sort: SortQ
}
const respondToAns = (ans) => {
  console.log('ShowQuestion needs to respond to answer:', ans);
  store.commit('updateProgress', {path: props.currentQ.qPath, userCorrect: ans.userWasCorrect})
  emits("q-finished", ans.userWasCorrect)
}
</script>

<template>
<!-- <p> current question is {{props.currentQ}} has key {{props.qKey}}</p> -->
<component v-bind:is="qTypes[currentQ.qType]" v-bind:qData="currentQ" v-bind:key="qKey"
      v-on:user-answered="respondToAns" class="showq-qblock" />
</template>

<style>
</style>