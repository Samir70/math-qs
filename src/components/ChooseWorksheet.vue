<script setup>
import { ref } from 'vue';
import { store } from '../store';
import { useRouter } from 'vue-router';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions)
const router = useRouter();

const worksheets = ref(store.state.worksheetList)

const chooseWorkSheet = (ws) => {
    console.log('ChooseWS: user wants to do worksheet:', ws.name)
    // need both of these in case user selects to do worksheet as quiz or just worksheet view
    store.commit('setQList', ws.topicList.map(t => t.split('-')))
    store.commit('setWorksheet', ws)
    router.push('/show_worksheet')
}
</script>

<template>
    <div id="worksheet-list">
        <h1>Choose a worksheet</h1>
        <p
            v-for="ws of worksheets"
            class="worksheet-title"
            v-on:click="chooseWorkSheet(ws)"
            key="ws.name"
        >{{ ws.name }}</p>
        <!-- <p>{{store.state.chosenQs}}</p> -->
    </div>
</template>

<style>
.worksheet-title {
    text-decoration: underline;
}
.worksheet-title:hover {
    background: violet;
}
</style>