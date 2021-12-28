<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';
import NavBar from './components/NavBar.vue';
const loggedIn = computed(() => store.state.loggedIn)
const router = useRouter();
</script>

<template>
  <h1>Maths Qs</h1>
  <NavBar />
  <p>Hello {{ store.state.user }}. You are {{ loggedIn ? '' : 'not' }} logged in.</p>
  <p v-if="!loggedIn">
    <router-link to="/login">Login</router-link>, please, if you want to save progress
  </p>
  <button v-if="loggedIn" v-on:click="store.commit('logout')">Log out</button>
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  white-space: pre-wrap;
}
</style>