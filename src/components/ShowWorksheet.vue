<script setup>
import { store } from '../store';
import { ref } from "vue";
import { getMathsQs } from 'math-q-factory';
const workSheetQs = ref(store.state.chosenQs.map(q => getMathsQs(...q)))
const showAnswers = ref(false);
const copyWS = () => {
    navigator.clipboard.writeText(workSheetQs.value.map(q => q.q).join('\n\n'))
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
            <button
                v-on:click="workSheetQs = store.state.chosenQs.map(q => getMathsQs(...q))"
            >Change all qs</button>
            <button v-on:click="showAnswers = !showAnswers">{{ showAnswers ? 'Hide' : 'Show' }} answers</button>
            <button v-on:click="toShow = 'question'">Show as quiz</button>
        </div>
        <div id="worksheet">
            <div v-for="q of workSheetQs">
                <p>
                    {{ q.q }}
                    <span v-if="showAnswers" class="worksheet-answer">....{{ q.a }}</span>
                </p>
                <br />
            </div>
        </div>
    </div>
</template>

<style>
#worksheet {
    background: whitesmoke;
    text-align: left;
}
.worksheet-answer {
    color: red;
}
</style>