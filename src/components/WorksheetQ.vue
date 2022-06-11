<script setup>
import { ref, onMounted, nextTick } from 'vue';
const props = defineProps({
    question: Object
});
const emits = defineEmits(['refreshQ'])
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
    console.log('refreshing ', props.question.qPath)
    showAns.value = false;
    emits('refreshQ', props.question.qPath)
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
            <div class="ws-button-box">
                <button title="add the building blocks for this question"><img
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