<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
import dashboardCWSrow from './dashboardCWSrow.vue';
import { diagnostics } from "../assets/diagnostics";
import ShowProgress from "../components/Progress/ShowProgress.vue";
const router = useRouter();
let userLevel = ref(store.state.userLevel.level);

let wantsToChangeLevel = ref(false);
const emits = defineEmits(emitActions)
const setLevel = (d) => {
    console.log('setting user level', diagnostics[d - 1].level, 'has', diagnostics[d - 1].topics.length, 'worksheets')
    store.commit('setUserLevel', diagnostics[d - 1]);
    userLevel.value = diagnostics[d - 1].level;
    wantsToChangeLevel.value = false;
}
</script>

<template>
    <h1>{{ store.state.user.name }}'s Dashboard</h1>
    <div id="dashboard-user-progress">
        <div v-if="userLevel" id="level-statement-box">
            <p>Your target level is: <span class="emphasis-bold">{{ userLevel }}</span> </p>
            <button v-on:click="wantsToChangeLevel = true">Change level</button>
        </div>
        <div v-if="!userLevel || wantsToChangeLevel">
            <h2>Pick a user level</h2>
            <div id="level-selection-box"></div>
            <button v-for="d in diagnostics.length" key="d" class="level-selection-button" v-on:click="setLevel(d)">{{
                    diagnostics[d - 1].level
            }}</button>
        </div>
    </div>
    <ShowProgress v-bind:user-progress="store.state.userProgress" />
    <div id="dashboard-custom-ws" class="dashboard-section">
        <h3>Custom worksheets</h3>
        <div v-if="store.state.customWorksheets.length === 0">
            <p>You haven't saved any worksheets</p>
        </div>
        <div v-else>
            <button v-if="store.state.haveUnsyncedCWSchanges" v-on:click="emits('save-cws')">Sync changes to custom
                worksheets</button>
            <div v-for="i in store.state.customWorksheets.length">
                <dashboardCWSrow class="cwsrow" v-bind:cws="store.state.customWorksheets[i - 1]" v-bind:index="i - 1"
                    v-bind:key="i" />
            </div>
        </div>
    </div>
    <p>Work is not saved to the online database until you click 'save'</p>
    <div>
        <h3>Getting started!</h3>
        <p>The easiest way is to click either the "Choose a Worksheet" or the "Choose a Chapter" button. <br />Then
            select a worksheet or topic to work on. </p>
        <p>Once you have chosen questions, you can either view as a list of questions with hidden answers (that you can
            reveal), or do one question at a time by selecting "show as quiz". The bingo option is better in a
            classroom, but you can have fun on your own too!</p>
    </div>

    <a href="https://icons8.com/license">Icons downloaded from icons8.com</a>
</template>

<style>
.cwsrow {
    width: 90%;
    margin: auto;
}

.cwsrow:hover {
    background: violet;
}

.emphasis-bold {
    font-weight: bold;
}

#level-selection-box {
    width: 95vw;
    display: flex;
    justify-content: space-between;
}

.level-selection-button {
    width: 25vw;
    margin: 2px 5px;
}

.dashboard-section {
    border: 1px solid darkblue;
    margin: 8px auto;
    box-shadow: 1px 10px 8px darkgray;
}

.dashboard-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
}
</style>