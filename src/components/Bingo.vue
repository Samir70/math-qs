<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { getMathsQs } from 'math-q-factory';
import { shuffleFY } from "../helperFuncs/shuffle";
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions)
const bingoQs = ref([]);
const bingoAnswers = ref([]);
const maxQs = ref(25)
const makeQs = () => {
    const ws = store.state.chosenWorksheet.topicList;
    console.log('making a bingo game!', maxQs.value)
    let qList = [], q = 0
    while (qList.length < maxQs.value) {
        if (q >= ws.length) { q = 0 }
        let [chapter, section, qName] = ws[q].split('-')
        let possQ = getMathsQs(chapter, section, qName);
        q++;
        // skip qs that don't have a good answer format for bingo
        if (possQ.qType !== 'shortAnswer' && possQ.qType !== 'multiChoice') {
            console.log('skipping q', q, possQ.qType)
            continue
        } else {
            qList.push(possQ)
        }
    }
    bingoAnswers.value = shuffleFY(qList.map(q => q.a))
    bingoQs.value = qList
    nextTick(() => MathJax.typeset());
}
const redoQs = () => {
    maxQs.value = maxQs.value === 25 ? 16 : 25
    makeQs()
}
onMounted(() => {
    makeQs()
})
</script>

<template>
    <h2>Making a bingo game from {{ store.state.chosenWorksheet.name }}</h2>
    <h3>Pick 9 answers from this grid</h3>
    <button v-on:click="redoQs">{{ maxQs === 25 ? 'Present only 16 answers' : 'Present 25 answers' }}</button>
    <div id="bingo-answerbox">
        <div v-for="a of bingoAnswers" class="bingo-answer">{{ a }}</div>
    </div>
    <!-- <p>{{ bingoQs }}</p> -->
</template>

<style>
#bingo-answerbox {
    display: flex;
    flex-wrap: wrap;
    width: 95vw;
    margin: auto;
    font-weight: bolder;
    justify-content: center;
}

.bingo-answer {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid black;
    font-size: 2em;
    width: auto;
    min-width: 18vw;
    padding: 3px;
    background: hsl(28, 87%, 67%);
}
</style>