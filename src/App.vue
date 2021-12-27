<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const loggedIn = ref(false)
const loggingIn = ref(false)
const router = useRouter();
const onLogin = () => {
  console.log('user logged in')
  loggedIn.value = true
  loggingIn.value = false
  router.push('/')
}
</script>

<template>
  <h1>Maths Qs</h1>
  <p v-if="!loggedIn && !loggingIn">
    You are not logged in.
    <router-link to="/login" v-on:click="loggingIn = true">Login</router-link> if you want to save progress
  </p>
  <button v-if="loggedIn" v-on:click="loggedIn = false">Log out</button>
  <router-view v-on:login="onLogin" ></router-view>
</template>