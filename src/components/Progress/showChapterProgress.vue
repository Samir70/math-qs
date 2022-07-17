<script setup>
import { ChapterTracker } from "../../assets/ProgressTracker";
const props = defineProps({
    chapter: ChapterTracker
})
</script>
<template>
    <div class="chapter-progress-card">
        <div class="chapter-progress-summary">
            <h2>{{chapter.chapterName}}</h2>
            <p class="score-summary">{{chapter.numberOfCorrectAnswers}} / {{chapter.numberOfQsAnswered}} correct</p>
            <p class="best-q-rating">Highest rating: {{chapter.highestRatingAnsweredCorrectly}}</p>
        </div>
        <div id="chapter-scores">
        </div>
        <h3>Sections</h3>
        <div v-for="section in chapter.listOfSections">{{section.sectionName}}</div>
    </div>
</template>

<style>
.chapter-progress-card {
    border: 1px solid darkblue;
    display: block;
    width: 45vw;
    min-width: 400px;
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