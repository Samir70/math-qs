<script setup>
import { store } from '../store';
</script>

<template>
    <h1>{{ store.state.userName }}'s Dashboard</h1>
    <p>Your progress will be shown here once that feature is implemented!</p>
    <!-- <p
        v-for="chapter in Object.keys(store.state.userProgress)"
    >{{ chapter }}:: {{ [...store.state.userProgress[chapter]] }}</p> -->
    <!-- <p>{{JSON.stringify(topicsToTest)}}</p> -->
</template>

<style>
</style>