<script setup>
import { store } from '../store';
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { getMathsQs } from 'math-q-factory';
import WorksheetQ from './WorksheetQ.vue';
import { emitActions } from '../helperFuncs/globalConsts';
import { qPaths } from '../assets/topicsToTest';
const emits = defineEmits(emitActions)
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
const copyQs = () => {
    navigator.clipboard.writeText(workSheetQs.value.map(q => q.q).join('\n\n'))
}
const changeAllQs = () => {
    workSheetQs.value = workSheetQs.value.map(q => getMathsQs(...q.qPath.split('-'))).map(displayableQ)
    nextTick(() => MathJax.typeset())
}
const refreshQ = (path, i) => {
    console.log('showWS wants to refresh Q', i, path)
    let newQ = getMathsQs(...path.split('-'))
    workSheetQs.value[i-1] = displayableQ(newQ)
}
const addBBs = (bbs, i) => {
    let newQs = bbs.map(path => getMathsQs(...path.split('-'))).map(displayableQ)
    workSheetQs.value.splice(i-1, 0, ...newQs)
    console.log('Need to add these building blocks', bbs, 'at Q', i)
    let newName = store.state.chosenWorksheet.name
    if (newName.indexOf('(edited)') === -1) {newName += ' (edited)'}
    store.commit('setWorksheet', { name: newName, topicList: workSheetQs.value.map(q => q.qPath) })
}
const removeQ = (qPath, i) => {
    console.log(`User wants to remove q ${i}, which has path ${qPath}`)
    workSheetQs.value.splice(i-1, 1)
    let newName = store.state.chosenWorksheet.name
    if (newName.indexOf('(edited)') === -1) {newName += ' (edited)'}
    store.commit('setWorksheet', { name: newName, topicList: workSheetQs.value.map(q => q.qPath) })
    if (workSheetQs.value.length === 0) {
        router.push('./make_worksheet')
    }
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
            <button v-on:click="copyQs">Copy Qs to clipboard</button>
            <button v-on:click="changeAllQs">Change all qs</button>
            <button v-on:click="router.push('/show_question')">Show as quiz</button>
            <button v-on:click="router.push('/bingo')">Play as Bingo</button>
        </div>
        <div id="worksheet">
            <div v-for="i of workSheetQs.length">
                <WorksheetQ v-bind:question="workSheetQs[i - 1]" v-bind:qnum="i" v-bind:key="i"
                    v-bind:class="i % 2 ? 'wsq wsq-blue' : 'wsq wsq-green'" 
                    v-on:add-bbs="addBBs"
                    v-on:refresh-q="refreshQ" v-on:remove-q="removeQ" />
            </div>
        </div>
        <p>.</p>
    </div>
    <a href="https://icons8.com/license">Icons downloaded from icons8.com</a>
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