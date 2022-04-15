<script setup>
const props = defineProps({
    cws: Object
});
</script>

<template>
    <div class="cws-box">
        <div>{{cws.name}}</div>
        <button>delete</button>
    </div>
</template>

<style>
.cws-box {
    display: flex;
    justify-content: space-around;
}
</style>