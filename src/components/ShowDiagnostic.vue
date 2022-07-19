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
if (!level || topics.length === 0) { router.push('/') }

const diagStage = ref('starting');
const curTopic = ref(0);
const curQ = ref(0);
const diagProgTracker = ref(new ProgressTracker(`${level} Diagnostic`));

let left = 0, right = 0

const setFirstQ = confidence => {
    let len = topics[curTopic.value].topicList.length;
    left = 0, right = len - 1;
    let lowerQ = Math.floor(len / 4), mid = Math.floor(len / 2), upperQ = Math.floor(3 * len / 4);
    console.log({ len, lowerQ, mid, upperQ })
    curQ.value = confidence === 'low' ? lowerQ : confidence === 'high' ? upperQ : mid
    diagStage.value = 'running'
}

const getQSlug = n => topics[curTopic.value].topicList[curQ.value]

const respondToAns = ans => {
    /**
     * Normally get an ans object like
     * {userWasCorrect: true, userAns:'42', qAns:42}
     */
    diagProgTracker.value.trackNewQ(getQSlug(curQ.value), ans);
    store.commit('updateProgress', {path: getQSlug(curQ.value), userCorrect: ans})
    // aim is to find hardest question in this sorted list that the student can answer
    // that Q has to be within left and right.
    if (ans) {
        left = curQ.value
    } else {
        right = curQ.value - 1
    }
    console.log({ q: getQSlug(curQ.value), ans, left, right })
    if (left === right) {
        // finished this topic in the diagnostic
        curTopic.value += 1
        if (curTopic.value === topics.length) {
            curTopic.value = 0;
            diagStage.value = 'finished'
            return
        }
        curQ.value = 0
        diagStage.value = 'starting'
    } else {
        curQ.value = Math.floor((left + right) / 2) + 1
    }
}
</script>

<template>
    <h1>{{ level }} Diagnostic</h1>
    <div v-if="diagStage === 'starting'" id="find-student-confidence-level">
        <h2>The next worksheet of this diagnostic is {{ topics[curTopic].name.split('-')[0] }} <br /> it has
            {{ topics[curTopic].topicList.length }} questions</h2>
        <p>How confident are you on this topic?</p>
        <div id="confidence-level-buttons">
            <button v-on:click="setFirstQ('low')">Low</button>
            <button v-on:click="setFirstQ('medium')">Medium</button>
            <button v-on:click="setFirstQ('high')">High</button>
        </div>
    </div>
    <div v-if="diagStage === 'running'" id="run-diagnostic">
        <p>diagStage is {{diagStage}}</p>
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
</style>