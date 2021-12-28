<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';
const loggedIn = computed(() => store.state.loggedIn)
const router = useRouter();
</script>

<template>
  <h1>Maths Qs</h1>
  <p>Hello {{store.state.user}}. You are {{loggedIn ? '': 'not'}} logged in.</p>
  <p v-if="!loggedIn">
    <router-link to="/login" v-on:click="loggingIn = true">Login</router-link>, please, if you want to save progress
  </p>
  <button v-if="loggedIn" v-on:click="store.commit('logout')">Log out</button>
  <router-view></router-view>
</template>