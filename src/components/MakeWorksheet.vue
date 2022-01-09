<script setup>
import { ref } from 'vue';
const searchTerm = ref('')
</script>

<template>
<h2>Make a worksheet</h2>
<input type="text" placeholder="Search for..." v-model="searchTerm" />
<p>Searching for: {{searchTerm}}</p>
</template>

<style>
</style>