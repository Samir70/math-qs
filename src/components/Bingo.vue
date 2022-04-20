<script setup>
import { onMounted, ref } from 'vue';
import { store } from '../store';
import { emitActions } from '../helperFuncs/globalConsts';
const emits = defineEmits(emitActions)
const bingoQs = ref([]);
onMounted(() => {
    bingoQs.value = [1,2,3,4]
})

</script>

<template>
<p>{{bingoQs}}</p>
</template>

<style>
</style>