<script setup>
import { ref } from "vue";
import { ChapterTracker } from "../../assets/ProgressTracker";
import showSectionProgress from "./showSectionProgress.vue";
const props = defineProps({
    chapter: ChapterTracker
})
const showSections = ref(false); 
const toggleShowSections = () => showSections.value = !showSections.value
</script>
<template>
    <div class="chapter-progress-card">
        <div class="chapter-progress-summary">
            <h2>{{ chapter.chapterName }}</h2>
            <p class="score-summary">{{ chapter.numberOfCorrectAnswers }} / {{ chapter.numberOfQsAnswered }} correct</p>
            <p class="best-q-rating">Highest rating: {{ chapter.highestRatingAnsweredCorrectly }}</p>
        </div>
        <div v-if="chapter.chapterConfidence !== 'unknown'">You said your confidence on this topic was {{chapter.chapterConfidence}}</div>
        <div class="section-scores" v-on:click="toggleShowSections">
            <h3><span v-if="!showSections">Click to show</span> Sections</h3>
            <div v-if="showSections">
                <show-section-progress v-for="s in chapter.listOfSections" v-bind:section="s" />
            </div>
        </div>
    </div>
</template>

<style>
.chapter-progress-card {
    border: 1px solid darkblue;
    border-radius: 5%;
    display: block;
    width: 45vw;
    min-width: 390px;
    margin: 2vh auto;
    box-shadow: 1px 10px 12px darkgray;
}

.chapter-progress-summary {
    display: flex;
    justify-content: space-around;
    align-items: baseline;
    flex-wrap: wrap;
}
</style>