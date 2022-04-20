<script setup>
import { store } from '../store';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
    cws: Object,
    index: Number
});

const chooseWorkSheet = () => {
    console.log('dashboardCWSrow: user wants to do worksheet:', props.cws.name)
    // need both of these in case user selects to do worksheet as quiz or just worksheet view
    store.commit('setQList', props.cws.topicList.map(t => t.split('-')))
    store.commit('setWorksheet', props.cws)
    router.push('/show_worksheet')
}
const deleteWS = () => {
    console.log(`dashboardCWSrow: user wants to delete ws ${props.index}`)
    store.commit('deleteCustomWorksheet', props.index)
    store.commit('noteChangesToCWS', true)
}
</script>

<template>
    <div class="cws-box">
        <div v-on:click="chooseWorkSheet">{{cws.name}}</div>
        <button v-on:click="deleteWS">delete</button>
    </div>
</template>

<style>
.cws-box {
    display: flex;
    justify-content: space-between;
}
</style>