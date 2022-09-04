<script setup>
import { SectionTracker } from "../../assets/ProgressTracker";
const props = defineProps({
    section: SectionTracker
})
const percentCorrect = Math.round(props.section.numberOfCorrectAnswers / props.section.numberOfQsAnswered * 100)
const progBar = `linear-gradient(to right, green 0%, green ${percentCorrect}%, red ${percentCorrect}%, red 100%)`
</script>

<template>
    <div class="section-bar">
        <p class="section-name">{{ section.sectionName }}</p>
        <span class="prog-bar" v-bind:style="{ backgroundImage: progBar }">{{ percentCorrect }}%</span>
        <p class="section-rating">{{ section.highestRatingAnsweredCorrectly }}</p>
    </div>
</template>

<style>
.section-bar {
    display: flex;
    justify-content: space-evenly;
    align-items: baseline;
    margin: 1px auto;
}

.section-name {
    width: 25%;
    overflow-wrap: break-word;
}

.prog-bar {
    display: block;
    text-align: center;
    color: white;
    width: 50%;
    height: 1em;
    border: 1px solid red;
}

.section-rating {
    width: 20%;
}
</style>