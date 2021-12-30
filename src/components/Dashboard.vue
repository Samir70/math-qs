<script setup>
import { store } from '../store';
import { topicsToTest } from 'math-q-factory';
</script>

<template>
    <h1>{{ store.state.userName }}'s Dashboard</h1>
    <p
        v-for="chapter in Object.keys(store.state.userProgress)"
    >{{ chapter }}:: {{ [...store.state.userProgress[chapter]] }}</p>
    <!-- <p>{{JSON.stringify(topicsToTest)}}</p> -->
</template>

<style>
</style>