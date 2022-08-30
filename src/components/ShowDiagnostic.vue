<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { store } from '../store';
import { getMathsQs } from 'math-q-factory';
import { emitActions } from '../helperFuncs/globalConsts';
import { ProgressTracker } from "../assets/ProgressTracker";
import ShowProgress from "../components/Progress/ShowProgress.vue";
import ShowQuestion from "./ShowQuestion.vue";
const emits = defineEmits(emitActions);
const router = useRouter();

const { level, topics } = store.state.userLevel
const numTopics = Object.keys(topics).length;
if (!level || numTopics === 0) { router.push('/') }

const diagStage = ref('chooseTopic');
const chapterConfidence = ref('unknown')
const curQNum = ref(0);
const curChapter = ref('');
const completedChapters = ref(new Set())
const diagProgTracker = ref(new ProgressTracker(`${level} Diagnostic`));
if (store.state.diagnosticResults.level === level) {
    let [a, b] = store.state.diagnosticResults.completion;
    completedChapters.value = store.state.diagnosticResults.completedChapters
    diagProgTracker.value = ProgressTracker.from(
        store.state.diagnosticResults.results
    );
}

let left = 0, right = 0

const currentQ = ref('');
const qKey = ref(0);
const setFirstQ = confidence => {
    let len = topics[curChapter.value].topicList.length;
    left = 0, right = len - 1;
    let lowerQ = Math.floor(len / 4), mid = Math.floor(len / 2), upperQ = Math.floor(3 * len / 4);
    console.log({ len, lowerQ, mid, upperQ })
    curQNum.value = confidence === 'low' ? lowerQ : confidence === 'high' ? upperQ : mid
    currentQ.value = getMathsQs(...getQSlug().split('-'));
    diagStage.value = 'running'
    chapterConfidence.value = confidence;
    nextTick(() => MathJax.typeset())
}

const setChapter = topic => {
    console.log(`user wants to do ${topic} diagnostic`)
    curChapter.value = topic;
    diagStage.value = 'running';
    setFirstQ('medium')
}

// returns data needed to get a question from getMathQs, eg: data-median-odd-130
const getQSlug = () => topics[curChapter.value].topicList[curQNum.value]


const diagResponse = ans => {
    diagProgTracker.value.trackNewQ(getQSlug(curQNum.value), ans, chapterConfidence.value);
    // aim is to find hardest question in this sorted list that the student can answer
    // that Q has to be within left and right.
    if (ans) {
        left = curQNum.value + 1 // considered: (curQNum.value === right ? 1 : 0)
        // That allows last correct Q to be reasked, so it wasn't a fluke!
    } else {
        right = curQNum.value - 1
    }
    console.log('showDiagnostic:', { q: getQSlug(curQNum.value), ans, left, right })
    if (left > right) {
        // finished this topic in the diagnostic
        // have to ocntinue if left === right, in order to get asked q[left]
        completedChapters.value.add(curChapter.value);
        store.commit('updateDiagnosticResults', {
            level, date: Date(),
            completion: [completedChapters.value.size, numTopics],
            completedChapters,
            results: diagProgTracker.value
        })
        if (completedChapters.value.size === numTopics) {
            diagStage.value = 'finished'
            store.commit('addToDiagHistory', {
                title: diagProgTracker.value.title,
                date: diagProgTracker.value.dateOfLastQ.toDateString(),
                averageRating: Math.round(diagProgTracker.value.averageRating)
            })
            return
        }
        emits('save-progress');
        curQNum.value = 0
        diagStage.value = 'chooseTopic'
    } else {
        curQNum.value = left === right ? left : Math.floor((left + right) / 2) + 1
        /**
         * this sets curQNum to right when right === left + [0, 1, 2]
         * this is alright since, 
         *   if the student is down to the last three qs and keeps getting them wrong,
         * it is good to ask all the remaining qs
         */
    }
    currentQ.value = getMathsQs(...getQSlug().split('-'));
    qKey.value = qKey.value + 1
    // console.log("showDiag-DiagResponse: newQ is", currentQ)
    nextTick(() => MathJax.typeset())
}
onMounted(() => {
    MathJax.typeset()
})
</script>

<template>
    <h1>{{ level }} Diagnostic</h1>
    <p v-if="!store.state.loggedIn">Work done while not logged in is not saved!</p>
    <div v-if="diagStage === 'chooseTopic'" id="choose-topic">
        <h3>Choose a topic</h3>
        <div id="topic-selector">
            <button v-for="t in Object.keys(topics).filter(x => !completedChapters.has(x))"
                class="diagnostic-topic-button" v-on:click="setChapter(t)">{{ t }}</button>
        </div>
    </div>
    <div v-if="diagStage === 'starting'" id="find-student-confidence-level">
        <h2>The {{ topics[curChapter].name.split('-')[0] }} diagnostic has
            {{ topics[curChapter].topicList.length }} questions</h2>
        <p>How confident are you on this topic?</p>
        <div id="confidence-level-buttons">
            <button v-on:click="setFirstQ('low')">Low</button>
            <button v-on:click="setFirstQ('medium')">Medium</button>
            <button v-on:click="setFirstQ('high')">High</button>
        </div>
    </div>
    <div v-if="diagStage === 'running'" id="run-diagnostic">
        <!-- <p>diagStage is {{ diagStage }}</p> -->
        <!-- <p>We are on Q{{ curQNum }} - {{ getQSlug(curQNum) }}</p> -->
        <ShowQuestion v-bind:currentQ="currentQ" v-bind:qKey="qKey" v-on:q-finished="diagResponse" />
        <!-- <p>For testing</p> -->
        <!-- <button v-on:click="diagResponse(true)">Get it right!</button> -->
        <!-- <button v-on:click="diagResponse(false)">Get it wrong!</button> -->
    </div>
    <div v-if="diagStage === 'finished'">
        <p>You have finished the diagnostic! <br /> See the results below</p>
    </div>
    <ShowProgress v-bind:user-progress="diagProgTracker"
        v-bind:best-and-worst="diagProgTracker.getBestAndWorst()"
        v-on:click-save-prog="emits('save-progress')" />
</template>

<style>
#confidence-level-buttons {
    display: flex;
    justify-content: space-around;
}

#topic-selector {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 50vw;
    margin: auto;
}

.diagnostic-topic-button {
    margin: 1px 5px;
}
</style>