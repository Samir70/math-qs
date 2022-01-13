<script setup>
import { ref, watch } from 'vue';
import { store } from '../store';
import { useRouter } from 'vue-router';
import { qTrie } from '../assets/topicsToTest';
// console.log(JSON.stringify(qTrie))
const router = useRouter();
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
});
const addItem = (q) => {
    store.commit('addToWorksheet', q);
    currentWS.value = store.state.chosenWorksheet.topicList
}
const removeItem = (i) => {
    store.commit('removeFromWorksheet', i);
    currentWS.value = store.state.chosenWorksheet.topicList
}
const viewWorkSheet = () => {
    console.log('makeWS: user wants to do worksheet:')
    // need below in case user selects to do worksheet as quiz rather than just worksheet view
    store.commit('setQList', currentWS.value.map(t => t.split('-')))
    router.push('/show_worksheet')
}
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
                <li v-for="q of foundQs" v-on:click="addItem(q)">{{ q }}</li>
            </ul>
        </div>
        <div class="ws-list">
            <h3>Current worksheet</h3>
            <button v-on:click="viewWorkSheet">View workheet</button>
            <ul>
                <li
                    v-for="i in currentWS.length"
                    v-on:click="removeItem(i - 1)"
                >{{ currentWS[i - 1] }}</li>
            </ul>
        </div>
    </div>
</template>

<style>
#ws-lists {
    display: flex;
    justify-content: space-between;
}
li {
    padding: 3px;
}
li:hover {
    text-decoration: underline;
    background: violet;
}
</style>