<script setup lang="ts">
import { onMounted } from 'vue';
import { tokenValid } from '@/utils/utilScripts.vue';

onMounted(tokenValid);
</script>

<template>
  <router-view />
</template>