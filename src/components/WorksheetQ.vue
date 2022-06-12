<script setup>
import { ref, onMounted, nextTick } from 'vue';
const props = defineProps({
    question: Object,
    qnum: Number,
    isBingo: Boolean
});
const emits = defineEmits(['refresh-q', 'add-bbs'])
const showAns = ref(false)
const showHideAns = () => {
    showAns.value = !showAns.value
    nextTick(() => {
        MathJax.typeset()
    })
}
onMounted(() => {
    MathJax.typeset()
})
const refreshQ = () => {
    showAns.value = false;
    emits('refresh-q', props.question.qPath, props.qnum)
}
const addBBs = () => {
    let bbs = props.question.buildingBlocks
    if (bbs === undefined || bbs.length === 0) {
        alert('There are no building blocks for this question')
    } else {
        emits('add-bbs', bbs, props.qnum)
    }
}
</script>

<template>
    <div class="wsq-box">
        <div class="wsq-qbox">{{ question.q }}</div>
        <div class="wsq-sidebar">
            <div class="ans-space">
                <div v-if="showAns" class="wsq-abox" v-on:click="showHideAns">{{ question.a }}</div>
                <button v-else class="reveal-button" v-on:click="showHideAns">Show Answer</button>
            </div>
            <div v-if="!isBingo" class="ws-button-box">
                <button title="add the building blocks for this question" v-on:click="addBBs"><img
                        src="../assets/icons/icons8-laying-bricks-48.png" /></button>
                <button title="refresh this question" v-on:click="refreshQ"><img
                        src="../assets/icons/icons8-reset-48.png" /></button>
            </div>
        </div>
    </div>
</template>

<style>
.wsq-box {
    font-size: 2em;
}

.wsq-qbox {
    padding: 5px;
    width: 70vw;
    color: black;
}

.wsq-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.wsq-abox {
    width: 25vw;
    color: red;
}

.reveal-button {
    width: 25vw;
    color: green;
    font-size: 1em;
}

.ws-button-box {
    margin: 3px 0px 0px;
}
</style>