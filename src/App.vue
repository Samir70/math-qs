<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import firebase from 'firebase/compat/app';
import { store } from './store';
import NavBar from './components/NavBar.vue';
firebase.initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: "maths-qs.firebaseapp.com",
  projectId: "maths-qs",
  storageBucket: "maths-qs.appspot.com",
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
});
firebase.auth().onAuthStateChanged(user => {
  console.log('from onAuthStateChanged', user) 
  if (user) {
    store.commit('login');
    store.commit('changeUser', user.displayName || 'Guest')
  }
  console.log('from onAuthStateChanged:', store.state.userName)
})
</script>

<template>
  <h1>Maths Qs</h1>
  <NavBar />
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