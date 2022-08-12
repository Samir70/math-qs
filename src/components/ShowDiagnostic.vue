<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
import { ProgressTracker } from "../assets/ProgressTracker";
import ShowProgress from "../components/Progress/ShowProgress.vue";
const emits = defineEmits(emitActions);
const router = useRouter();

const { level, topics } = store.state.userLevel
const numTopics = Object.keys(topics).length;
if (!level || numTopics === 0) { router.push('/') }

const diagStage = ref('chooseTopic');
const chapterConfidence = ref('unknown')
const curQ = ref(0);
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

const setFirstQ = confidence => {
    let len = topics[curChapter.value].topicList.length;
    left = 0, right = len - 1;
    let lowerQ = Math.floor(len / 4), mid = Math.floor(len / 2), upperQ = Math.floor(3 * len / 4);
    console.log({ len, lowerQ, mid, upperQ })
    curQ.value = confidence === 'low' ? lowerQ : confidence === 'high' ? upperQ : mid
    diagStage.value = 'running'
    chapterConfidence.value = confidence;
}

const setChapter = topic => {
    console.log(`user wants to do ${topic} diagnostic`)
    curChapter.value = topic;
    diagStage.value = 'starting';
}

const getQSlug = n => topics[curChapter.value].topicList[curQ.value]

const respondToAns = ans => {
    /**
     * Normally get an ans object like
     * {userWasCorrect: true, userAns:'42', qAns:42}
     */
    diagProgTracker.value.trackNewQ(getQSlug(curQ.value), ans, chapterConfidence.value);
    store.commit('updateProgress', { path: getQSlug(curQ.value), userCorrect: ans })
    // aim is to find hardest question in this sorted list that the student can answer
    // that Q has to be within left and right.
    if (ans) {
        left = curQ.value + 1 // considered: (curQ.value === right ? 1 : 0)
        // That allows last correct Q to be reasked, so it wasn't a fluke!
    } else {
        right = curQ.value - 1
    }
    console.log({ q: getQSlug(curQ.value), ans, left, right })
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
        curQ.value = 0
        diagStage.value = 'chooseTopic'
    } else {
        curQ.value = left === right ? left : Math.floor((left + right) / 2) + 1
        /**
         * this sets curQ to right when right === left + [0, 1, 2]
         * this is alright since, 
         *   if the student is down to the last three qs and keeps getting them wrong,
         * it is good to ask all the remaining qs
         */
    }
}
</script>

<template>
    <h1>{{ level }} Diagnostic</h1>
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
        <p>diagStage is {{ diagStage }}</p>
        <p>We are on Q{{ curQ }} - {{ getQSlug(curQ) }}</p>
        <button v-on:click="respondToAns(true)">Get it right!</button>
        <button v-on:click="respondToAns(false)">Get it wrong!</button>
    </div>
    <div v-if="diagStage === 'finished'">
        <p>You have finished the diagnostic! <br /> See the results below</p>
    </div>
    <ShowProgress v-bind:user-progress="diagProgTracker" />
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