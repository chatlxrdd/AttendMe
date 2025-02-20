<script setup lang="ts">
import { onMounted } from 'vue';
import { tokenValid } from '@/utils/utilScripts.vue';

onMounted(tokenValid);
</script>

<template>
  <header>
    <nav>
      <h1>JEBAĆ ŻYDÓW</h1>
    </nav>
  </header>
  <router-view />
</template>