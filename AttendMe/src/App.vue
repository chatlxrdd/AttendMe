<script setup lang="ts">
import { onMounted } from 'vue';
import { tokenValid } from '@/utils/utilScripts.vue';
import navBar from '@/components/Navbar.vue';

onMounted(tokenValid);
</script>

<template>
  <header>
    <nav>
      <navBar />
    </nav>
  </header>
  <router-view />
</template>