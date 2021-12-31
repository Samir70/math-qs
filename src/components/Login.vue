<script setup>
import { store } from '../store';
import { useRouter } from 'vue-router';
const router = useRouter();
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: "maths-qs.firebaseapp.com",
  projectId: "maths-qs",
  storageBucket: "maths-qs.appspot.com",
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
  guest:'Guest'
};
// console.log('From Login: ', firebaseConfig)
const login = () => {
    store.commit('login')
    store.commit('changeUser', firebaseConfig.guest)
    router.push('/')
}
</script>

<template>
    <h1>Login Page</h1>
    <button v-on:click="login">Log in</button>
</template>