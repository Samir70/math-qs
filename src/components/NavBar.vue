<script setup>
import { computed } from 'vue';
import { store } from '../store';
import firebase from 'firebase/compat/app';
const loggedIn = computed(() => store.state.loggedIn)
const logout = () => {
    firebase.auth().signOut()
    store.commit('logout');
    store.commit('changeUser', 'Unknown User');
}
</script>

<template>
    <router-link to="/" class="navbar-item">Home</router-link>
    <router-link v-if="!loggedIn" to="/login" class="navbar-item">Login</router-link>
    <button v-else v-on:click="logout">Log Out</button>
    <router-link to="/choose_worksheet" class="navbar-item">Choose a worksheet</router-link>
    <router-link to="/make_worksheet" class="navbar-item">Make a worksheet</router-link>
    <router-link to="/choose_chapter" class="navbar-item">Choose a chapter</router-link>
</template>

<style>
.navbar-item {
    display: inline-block;
    margin: 2px;
    padding: 3px 8px;
    background: cadetblue;
    border: 1px solid darkblue;
}
</style>