<script setup>
import { useRouter } from "vue-router";
import { store } from '../../store';
import { ProgressTracker } from "../../assets/ProgressTracker";
import showChapterProgress from "./showChapterProgress.vue";
import { makeWSObject } from "../../assets/worksheets";

const props = defineProps({
    userProgress: ProgressTracker,
    bestAndWorst: Object,
    allowSave: Boolean
})
console.log('ShowProgress from', props.userProgress)
const router = useRouter();
const emits = defineEmits(['click-save-prog'])

const makeWorksheetFromMistakes = () => {
    if (props.userProgress.size === 0) {
        alert("You haven't got any uncorrected mistakes");
        return
    }
    console.log('User Wants to make a worksheet from mistakes');
    let qs = [...props.userProgress.mistakeList].map(q => q.split('-')).sort((a, b) => a[3] - b[3]).map(q => q.join('-'));
    store.commit('setWorksheet', makeWSObject(`Worksheet from ${store.state.user.name}'s mistakes`, "Math-Qs pixies", qs));
    router.push('/show_worksheet');
}
const copyProgressToCSV = () => {
    console.log('User Wants to copy progress')
    console.log(props.userProgress.copyToCSV())
    navigator.clipboard.writeText(props.userProgress.copyToCSV().join('\n'))
}
</script>
<template>
    <h2>Your {{ userProgress.title }} </h2>
    <h3>Your rating: {{ Math.round(userProgress.studentRating) }}</h3>
    <div id="progress-box" class="progress-section">
        <div id="progress-overview" class="progress-flex">
            <div id="progress-summary">
                <p>You have answered questions from {{ Object.keys(userProgress.listOfChapters).length }} chapters</p>
                <p>Average rating of chapters: {{ Math.round(userProgress.averageRating) }}</p>
                <p v-if="bestAndWorst.best.chapter !== ''">Best chapter: <span class="emphasis-bold">{{
                        bestAndWorst.best.chapter
                }}</span>
                    where your rating is {{ bestAndWorst.best.rating }}</p>
                <p v-if="bestAndWorst.worst.chapter !== ''">Worst chapter: <span class="emphasis-bold">{{
                        bestAndWorst.worst.chapter
                }}</span>
                    where your rating is {{ bestAndWorst.worst.rating }}</p>
            </div>
            <div id="progress-buttons">
                <p>You have {{ userProgress.mistakeList.size === 0 ? 'no' : userProgress.mistakeList.size }}
                    {{ userProgress.mistakeList.size === 1 ? 'mistake' : 'mistakes' }} to correct</p>
                <button v-if="allowSave" v-on:click="emits('click-save-prog')" title="Save progress to cloud"><img
                        src="../../assets/icons/icons8-save-100.png" class="progress-button-image" /></button>
                <button v-if="userProgress.mistakeList.size > 0" title="Make a worksheet from your mistakes"
                    v-on:click="makeWorksheetFromMistakes">
                    <img src="../../assets/icons/icons8-list-64.png" class="progress-button-image" /></button>
                <button title="Copy progress to CSV" v-on:click="copyProgressToCSV">
                    <img src="../../assets/icons/icons8-copy-50.png" class="progress-button-image" /></button>
            </div>
        </div>
        <div id="progress-by-chapter" class="progress-flex">
            <div v-for="c in userProgress.listOfChapters">
                <showChapterProgress v-bind:chapter="c" />
            </div>
        </div>
    </div>
</template>

<style>
.progress-section {
    border: 1px solid darkblue;
    margin: 8px auto;
    box-shadow: 1px 10px 8px darkgray;
}

.progress-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
}

.progress-button-image {
    width: 60px;
    height: 60px;
}
</style>