<script setup lang="ts">
import { onMounted } from 'vue';
import { tokenValid } from '@/utils/TestToken.vue';

onMounted(tokenValid);
</script>

<template>
  <router-view />
</template>