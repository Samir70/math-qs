<script setup>
import { topicLevels } from "../assets/topicLevels";

const props = defineProps({
    title: String,
    totalQs: Number,
    completedQs: Number,
    minLevel: Number,
    maxLevel: Number
})

const minL = topicLevels.find(t => t[0] < props.minLevel)
const maxL = topicLevels.find(t => t[0] < props.maxLevel)
const levelText = minL[0] === maxL[0] ? minL[1] : `${minL[1]} -> ${maxL[1]}`
const levelCol = `linear-gradient(to right, ${minL[2]} 0%, ${minL[2]} 50%, ${maxL[2]} 50%, ${maxL[2]} 100%)`
</script>

<template>
    <div class="chapter-card">
        <h2>{{ props.title }}</h2>
        <p>Completed {{ props.completedQs }}/{{ props.totalQs }} questions</p>
        <div id="chapter-level">
            <p id="level-dot" v-bind:style="{ backgroundImage: levelCol }">LL</p>
            <p>{{ levelText }}</p>
        </div>
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

#chapter-level {
    display: flex;
    justify-content: center;
}

#level-dot {
    color: transparent;
    user-select: none;
    border-radius: 50%;
    margin-right: 10px;
}
</style>