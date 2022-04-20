<script setup>
import { onMounted, ref } from 'vue';
import { getMathsQs } from 'math-q-factory';
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions)
const bingoQs = ref([]);
onMounted(() => {
    const ws = store.state.chosenWorksheet.topicList;
    console.log('making a bingo game!', ws)
    let qList = [], q = 0
    while (qList.length < 25) {
        if (q >= ws.length) {q = 0}
        let [chapter, section, qName] = ws[q].split('-')
        qList.push(getMathsQs(chapter, section, qName))
        q++
    }
    bingoQs.value = qList
})

</script>

<template>
<h2>Making a bingo game from {{store.state.chosenWorksheet.name}}</h2>
<div id="bingo-answerbox">

</div>
<p>{{bingoQs}}</p>
</template>

<style>
</style>