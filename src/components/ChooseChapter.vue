<script setup>
import { useRouter } from 'vue-router';
import { store } from '../store';
import { totalQs } from 'math-q-factory';
import { qPaths } from '../assets/topicsToTest';
import ChapterCard from './ChapterCard.vue';
import { emitActions } from '../helperFuncs/globalConsts';
import { topicLevels } from "../assets/topicLevels";
const emits = defineEmits(emitActions)
const findLevel = n => topicLevels.find(t => t[0] < n)[0]
let chapterSet = Object.keys(totalQs).sort((a, b) =>
    findLevel(totalQs[a].min) === findLevel(totalQs[b].min) ?
        totalQs[a].max - totalQs[b].max : totalQs[a].min - totalQs[b].min)
// console.log('ChooseChapter:', chapterSet);
const router = useRouter();

const setLearnChapter = (title) => {
    console.log('user wants to learn', title);
    store.commit('setChapter', title);
    store.commit('setWorksheet', { name: title, topicList: qPaths.filter(t => t[0] === title).map(t => t.join('-')) });
    router.push('/show_worksheet')
}
</script>

<template>
    <h1>Choose a Chapter</h1>
    <div class="chapter-card-list">
        <!-- Chapter card no longer making use of contents attribute, which used to list sections -->
        <ChapterCard v-for="chapter of chapterSet" v-bind:title="chapter"
            v-bind:completedQs="store.state.userProgress[chapter] === undefined ? 0 : store.state.userProgress[chapter].size"
            v-bind:totalQs="totalQs[chapter].qCount || 0" v-bind:minLevel="totalQs[chapter].min"
            v-bind:maxLevel="totalQs[chapter].max" v-on:click="setLearnChapter(chapter)" />
    </div>
</template>

<style>
.chapter-card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>