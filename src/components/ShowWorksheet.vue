<script setup>
import { store } from '../store';
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { getMathsQs } from 'math-q-factory';
import WorksheetQ from './WorksheetQ.vue';
const router = useRouter();
const displayableQ = question => {
    // shortAnswer, multiChoice Qs can be asked without modification
    // Matching Qs will need the options listed
    // Elimination and classify Qs will need to pick a question or convert to matching.
    if (question.qType === 'sort') {
        console.log('modifying sortQ')
        question.a = question.a.join(', ')
    }
    if (question.qType === 'match') {
        question.q = 'Sorry, matching type questions are not supported for worksheets'
        question.a = '??'
    }
    if (question.qType === 'classify') {
        question.q = 'Sorry, classification type questions are not supported for worksheets'
        question.a = '??'
    }
    if (question.qType === 'elimination') {
        question.q = 'Sorry, elimination type questions are not supported for worksheets'
        question.a = '??'
    }
    return question
}
const workSheetQs = ref(store.state.chosenWorksheet.topicList.map(path => getMathsQs(...path.split('-'))).map(displayableQ))
const copyWS = () => {
    navigator.clipboard.writeText(workSheetQs.value.map(q => q.q).join('\n\n'))
}
const changeAllQs = () => {
    workSheetQs.value = store.state.chosenQs.map(q => getMathsQs(...q)).map(displayableQ)
    nextTick(() => MathJax.typeset())
}
</script>

<template>
    <div>
        <h2>
            Viewing questions from
            <br />
            {{ store.state.chosenWorksheet.name }}
        </h2>
        <div id="action-buttons">
            <button v-on:click="copyWS">Copy to clipboard</button>
            <button v-on:click="changeAllQs">Change all qs</button>
            <button v-on:click="router.push('/show_question')">Show as quiz</button>
        </div>
        <div id="worksheet">
            <div v-for="i of workSheetQs.length">
                <WorksheetQ
                    v-bind:question="workSheetQs[i - 1]"
                    v-bind:key="i"
                    v-bind:class="i % 2 ? 'wsq wsq-blue' : 'wsq wsq-green'"
                />
            </div>
        </div>
        <p>.</p>
    </div>
</template>

<style>
.wsq {
    border: 1px solid black;
    border-radius: 5%;
    padding: 5px;
    margin: 1px 0px;
    display: flex;
    justify-content: space-around;
    font-weight: bolder;
}
.wsq-blue {
    background: rgb(201, 243, 245);
    border-left: 5px solid darkblue;
}
.wsq-green {
    background: rgb(184, 235, 184);
    border-left: 5px solid darkgreen;
}
</style>