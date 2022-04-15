<script setup>
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
import dashboardCWSrow from './dashboardCWSrow.vue';
const emits = defineEmits(emitActions)
</script>

<template>
    <h1>{{ store.state.userName }}'s Dashboard</h1>
    <p>Your progress will be shown here once that feature is implemented!</p>
    <p>Work is not saved to the online database until you click 'sync'</p>
    <div id="dashboard-custom-ws">
        <h3>Custom worksheets</h3>
        <div v-if="store.state.customWorksheets.length === 0">
            <p>You haven't saved any worksheets</p>
        </div>
        <div v-else>
            <div v-for="ws in store.state.customWorksheets">
                <dashboardCWSrow v-bind:cws="ws" />
            </div>
        </div>
    </div>

    <!-- <p
        v-for="chapter in Object.keys(store.state.userProgress)"
    >{{ chapter }}:: {{ [...store.state.userProgress[chapter]] }}</p> -->
    <!-- <p>{{JSON.stringify(topicsToTest)}}</p> -->
</template>

<style>
</style>