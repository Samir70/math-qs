<script setup>
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
import dashboardCWSrow from './dashboardCWSrow.vue';
const emits = defineEmits(emitActions)
</script>

<template>
    <h1>{{ store.state.user.name }}'s Dashboard</h1>
    <!-- <h2>uid: {{store.state.user.uid}}</h2> -->
    <p>Your progress will be shown here once that feature is implemented!</p>
    <p>Work is not saved to the online database until you click 'save'</p>
    <div id="dashboard-custom-ws">
        <h3>Custom worksheets</h3>
        <div v-if="store.state.customWorksheets.length === 0">
            <p>You haven't saved any worksheets</p>
        </div>
        <div v-else>
            <button v-if="store.state.haveUnsyncedCWSchanges" v-on:click="emits('save-cws')">Sync changes to custom worksheets</button>
            <div v-for="i in store.state.customWorksheets.length">
                <dashboardCWSrow class="cwsrow" v-bind:cws="store.state.customWorksheets[i - 1]" v-bind:index="i-1" v-bind:key="i" />
            </div>
        </div>
    </div>

    <!-- <p
        v-for="chapter in Object.keys(store.state.userProgress)"
    >{{ chapter }}:: {{ [...store.state.userProgress[chapter]] }}</p> -->
    <!-- <p>{{JSON.stringify(topicsToTest)}}</p> -->
</template>

<style>
.cwsrow {
    width: 90%;
    margin: auto;
}
.cwsrow:hover {
    background: violet;
}
</style>