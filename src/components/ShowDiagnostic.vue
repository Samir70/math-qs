<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions);
const router = useRouter();

const { level, topics } = store.state.userLevel
if (!level || topics.length === 0) { router.push('/') }

</script>

<template>
    <h1>{{ level }} Diagnostic</h1>
    <p>{{ topics.map(t => t.name).join(', ') }}</p>
</template>

<style>
</style>