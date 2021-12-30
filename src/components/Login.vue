<script setup>
import { store } from '../store';
import { useRouter } from 'vue-router';
const router = useRouter();
const login = () => {
    store.commit('login')
    store.commit('changeUser', 'Guest')
    router.push('/')
}
</script>

<template>
    <h1>Login Page</h1>
    <button v-on:click="login">Log in</button>
</template>