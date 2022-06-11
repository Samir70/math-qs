<script setup>
import { useRouter } from 'vue-router';
import { store } from '../store';
import { totalQs } from 'math-q-factory';
import { qPaths } from '../assets/topicsToTest';
import ChapterCard from './ChapterCard.vue';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions)
let chapterSet = new Set(Object.keys(totalQs))
console.log('ChooseChapter:', chapterSet);
const router = useRouter();

const setLearnChapter = (title) => {
    console.log('user wants to learn', title);
    store.commit('setChapter', title);
    store.commit('setWorksheet', {name:title, topicList: qPaths.filter(t => t[0] === title).map(t => t.join('-'))});
    router.push('/show_question')
}
</script>

<template>
    <h1>Choose a Chapter</h1>
    <div class="chapter-card-list">
        <!-- Chapter card no longer making use of contents attribute, which used to list sections -->
        <ChapterCard
            v-for="chapter in chapterSet"
            v-bind:title="chapter"
            v-bind:completedQs="store.state.userProgress[chapter] === undefined ? 0 : store.state.userProgress[chapter].size"
            v-bind:totalQs="totalQs[chapter] || 0"
            v-on:click="setLearnChapter(chapter)"
        />
    </div>
</template>

<style>
.chapter-card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>