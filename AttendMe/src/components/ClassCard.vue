<script setup lang="ts">
defineProps<{ name: string; id: number }>();
</script>

<template>
  <li>
    <router-link :to="'/class/' + id">{{ name }}</router-link>
  </li>
</template>

<style scoped>
li {
  margin: 10px 0;
}
a {
  text-decoration: none;
  color: blue;
}
</style>
