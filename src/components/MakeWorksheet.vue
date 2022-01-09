<script setup>
import { ref } from 'vue';
import { qTrie } from '../assets/topicsToTest';
// console.log(JSON.stringify(qTrie))
const searchTerm = ref('');
const foundQs = ref([])
const updateFound = () => {
    console.log('MWS: searching for', searchTerm.value)
    console.log('MWS: ', qTrie.search(searchTerm.value))
    foundQs.value = qTrie.search(searchTerm.value)
}
</script>

<template>
    <h2>Make a worksheet</h2>
    <input type="text" placeholder="Search for..." v-model="searchTerm" v-on:change="updateFound" />
    <p v-if="foundQs.length === 0">{{searchTerm === '' ? 'Enter a search term' : `No Qs found for '${searchTerm}'`}}</p>
    <ul>
        <li v-for="q of foundQs">{{q}}</li>
    </ul>
</template>

<style>
</style>