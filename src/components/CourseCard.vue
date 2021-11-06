<script setup>
const props = defineProps({
    title: String,
    contents: Object
})
</script>

<template>
<h2>{{props.title}}</h2>
<p>{{props.contents}}</p>
</template>