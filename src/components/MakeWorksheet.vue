<script setup>
import { ref, watch, computed } from 'vue';
import { store } from '../store';
import { useRouter } from 'vue-router';
import { qTrie } from '../assets/topicsToTest';
import { emitActions } from '../helperFuncs/globalConsts';
import { makeBBList, getMathsQs } from 'math-q-factory';
const emits = defineEmits(emitActions)
const router = useRouter();
const searchTerm = ref('');
const foundQs = ref([])
const currentWS = ref(store.state.chosenWorksheet.topicList)
const nameNewWS = ref(store.state.chosenWorksheet.name);
const loggedIn = computed(() => store.state.loggedIn);
watch(searchTerm, (newVal, oldval) => {
    let words = newVal.toLowerCase().split(' ')
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
    if (currentWS.value.length > 0) {
        router.push('/show_worksheet')
    } else {
        alert('There are no questions in the worksheet!')
    }
}
const defaultName = () => {
    let d = new Date()
    return `Unnamed worksheet ${d.toDateString()}`
}
const clearWorksheet = () => {
    console.log('makeWS: clearing worksheet');
    store.commit('setWorksheet', { name: defaultName(), topicList: [] })
    currentWS.value = store.state.chosenWorksheet.topicList;
    nameNewWS.value = store.state.chosenWorksheet.name
}
const makeFromBBs = () => {
    console.log(`user wants to make worksheet from ${currentWS.value[0]}`)
    let temp = makeBBList(currentWS.value[0], getMathsQs)
    temp.push(currentWS.value[0])
    if (temp.length === 1) {
        alert("This question doesn't seem to have building blocks. Sorry. You might find hints if you do this worksheet as a quiz.")
    } else {
        nameNewWS.value = `Worksheet for ${currentWS.value[0]}`
        store.commit('setWorksheet', { name: nameNewWS.value, topicList: temp })
        currentWS.value = store.state.chosenWorksheet.topicList
    }
    console.log(temp)
}
const copyWS = () => {
    navigator.clipboard.writeText(JSON.stringify(store.state.chosenWorksheet, null, 2));
}
const saveTopiclist = () => {
    let wsDoc = {
        name: nameNewWS.value || defaultName(),
        creator: store.state.user.name,
        topicList: currentWS.value
    };
    console.log('makeWS: Copying topiclist to clipboard');
    navigator.clipboard.writeText(JSON.stringify(wsDoc, null, '\t'));
    if (store.state.customWorksheets.length < store.state.maxCustomWorksheets) {
        store.commit('addCustomWorksheet', wsDoc)
        store.commit('noteChangesToCWS', true)
    } else {
        alert(`You have already saved ${store.state.maxCustomWorksheets} custom worksheets. \nThat is as many as you can save. \nDelete one of your saved worksheets to save this one.`)
    }
}
</script>

<template>
    <h2>Make a worksheet</h2>
    <input type="text" placeholder="Search for..." v-model="searchTerm" />
    <p v-if="foundQs.length === 0">{{ searchTerm === '' ? 'Enter a search term' : `No Qs found for '${searchTerm}'` }}
    </p>
    <div id="makeWS-options-box">
        <button v-if="loggedIn" v-on:click="saveTopiclist">Add to custom worksheet list</button>
        <button v-if="!loggedIn" v-on:click="router.push('/login?page=make_worksheet')">Log in to save
            worksheet</button>
        <button v-on:click="clearWorksheet">Empty current worksheet</button>
        <button v-on:click="copyWS">Copy worksheet to clipboard</button>
        <button v-on:click="viewWorkSheet">View workheet</button>
    </div>
    <div id="ws-lists">
        <div class="ws-list">
            <h3>Click to add to worksheet</h3>
            <ul>
                <li v-for="q of foundQs" v-on:click="addItem(q)">{{ q }}</li>
            </ul>
        </div>
        <div class="ws-list">
            <h3>
                <input class="ws-name" type="text" v-model="nameNewWS"
                    placeholder="Type in a name of the new Worksheet" />
            </h3>
            <ul>
                <li v-for="i in currentWS.length" v-on:click="removeItem(i - 1)">{{ currentWS[i - 1] }}</li>
            </ul>
            <button v-if="currentWS.length === 1" v-on:click="makeFromBBs">Make a worksheet from chosen question's
                building blocks</button>
        </div>
    </div>
</template>

<style>
#ws-lists {
    display: flex;
    justify-content: space-around;
    max-width: 1000px;
    margin: auto;
}

.ws-name {
    width: 90%;
    min-width: 250px;
    padding: 5px;
    background-color: inherit;
}

.ws-name:focus {
    background-color: white;
}

li {
    padding: 3px;
}

li:hover {
    text-decoration: underline;
    background: violet;
}

#makeWS-options-box {
    display: flex;
    justify-content: center;
    margin: auto;
}
</style>