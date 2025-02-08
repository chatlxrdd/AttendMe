<template>
  <div id="app">
    <!-- Włączenie komponentu logowania -->
    <LoginWykladowcy />
  </div>
</template>

<script>
import LoginWykladowcy from './components/LoginWykladowcy.vue';

export default {
  name: 'App',
  components: {
    LoginWykladowcy
  }
};
</script>

<style>
/* Globalne style aplikacji */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
