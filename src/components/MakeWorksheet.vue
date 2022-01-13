<script setup>
import { ref, watch } from 'vue';
import { store } from '../store';
import { qTrie } from '../assets/topicsToTest';
// console.log(JSON.stringify(qTrie))
const searchTerm = ref('');
const foundQs = ref([])
const currentWS = ref(store.state.chosenWorksheet.topicList)
watch(searchTerm, (newVal, oldval) => {
    let words = newVal.split(' ')
    // console.log('MWS: searching for', words)
    let toList = words[0] ? [...qTrie.search(words[0])] : []
    // console.log('MWS: found', toList)
    for (let i = 1; i < words.length; i++) {
        if (words[i] === '') { continue }
        let newList = qTrie.search(words[i]);
        // console.log('must also include', newList)
        toList = toList.filter(qp => newList.has(qp))
    }
    foundQs.value = toList
})
</script>

<template>
    <h2>Make a worksheet</h2>
    <input type="text" placeholder="Search for..." v-model="searchTerm" />
    <p
        v-if="foundQs.length === 0"
    >{{ searchTerm === '' ? 'Enter a search term' : `No Qs found for '${searchTerm}'` }}</p>
    <div id="ws-lists">
        <div class="ws-list">
            <h3>Click to add to worksheet</h3>
            <ul>
                <li v-for="q of foundQs">{{ q }}</li>
            </ul>
        </div>
        <div class="ws-list">
            <h3>Current worksheet</h3>
            <ul>
                <li v-for="i in currentWS.length">{{currentWS[i-1]}}</li>
            </ul>
        </div>
    </div>
</template>

<style>
#ws-lists {
    display: flex;
    justify-content: space-between;
}
</style>