<script setup>
import { ref } from "vue";
const emits = defineEmits(['login']);
</script>

<template>
    <h1>Login Page</h1>
    <button v-on:click="$emit('login')">Log in</button>
</template>