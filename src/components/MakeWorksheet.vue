<script setup>
import { ref, watch } from 'vue';
import { qTrie } from '../assets/topicsToTest';
// console.log(JSON.stringify(qTrie))
const searchTerm = ref('');
const foundQs = ref([])
watch(searchTerm, (newVal, oldval) => {
    let firstWord = newVal.split(' ')[0]
    foundQs.value = newVal === '' ? [] : qTrie.search(firstWord)
})
</script>

<template>
    <h2>Make a worksheet</h2>
    <input type="text" placeholder="Search for..." v-model="searchTerm" />
    <p v-if="foundQs.length === 0">{{searchTerm === '' ? 'Enter a search term' : `No Qs found for '${searchTerm}'`}}</p>
    <ul>
        <li v-for="q of foundQs">{{q}}</li>
    </ul>
</template>

<style>
</style>