<script setup>
import { computed } from '@vue/reactivity';

const props = defineProps({
    title: String,
    contents: Object,
    totalQs: Number,
    completedQs: Number
})
const emits = defineEmits(['review-chapter', 'learn-chapter'])
const sections = computed(() => Object.keys(props.contents));
// console.log({chapter:props.title, sections:sections.value})
console.log(props)
</script>

<template>
    <div class="chapter-card">
        <h2>{{ props.title }}</h2>
        <p>Completed {{ props.completedQs }}/{{ props.totalQs }} questions</p>
        <p>{{ sections.join(', ') }}</p>
        <button v-on:click="$emit('review-chapter', props.title)" class="button review">Review</button>
        <button v-on:click="$emit('learn-chapter', props.title)" class="button learn">Learn</button>
    </div>
</template>

<style scoped>
.chapter-card {
    display: block;
    width: 40vw;
    margin: 1vw;
    min-width: 200px;
    flex: 0 0 auto;
    border: 2px solid darkcyan;
    box-shadow: 1px 2px 2px darkgray;
}
.chapter-card:hover {
    background: lightblue;
    box-shadow: 5px 5px 5px darkgray;
}
.button {
    font-size: 125%;
    margin: 5px;
    box-shadow: 1px 2px 2px darkgray;
}
.button:hover {
    box-shadow: 5px 5px 5px darkgray;
}
.review {
    background: rgb(131, 240, 131);
}
.learn {
    background: rgb(0, 204, 255);
}
</style>