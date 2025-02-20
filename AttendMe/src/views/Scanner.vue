<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tokenScanner = ref(route.params.tokenScanner as string);

console.log(tokenScanner.value)


</script>
<template>
    <h1>Skaner KURWA</h1>
</template>
