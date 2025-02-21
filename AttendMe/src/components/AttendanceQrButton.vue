<script setup lang="ts">
import { ref } from "vue";
const deviceToken = ref(localStorage.getItem("authDevice"));
</script>

<template>
  <button v-if="deviceToken" @click="$router.push('/student/qr/')">Rejestruj obecność</button>
</template>
  
<style scoped>

</style>
  