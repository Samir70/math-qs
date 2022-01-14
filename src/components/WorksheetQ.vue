<script setup>
import { ref } from 'vue';
const props = defineProps({
    question: Object
});
const showAns = ref(false)
</script>

<template>
    <div class="wsq-box">
        <div class="wsq-qbox">{{ question.q }}</div>
        <div v-if="showAns" class="wsq-abox" v-on:click="showAns = !showAns">{{ question.a }}</div>
        <button v-else class="reveal-button" v-on:click="showAns = !showAns">Show Answer</button>
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
.wsq-abox {
    width: 25vw;
    color: red;
}
.reveal-button {
    width: 25vw;
    color: green;
    font-size: 1em;
}
</style>