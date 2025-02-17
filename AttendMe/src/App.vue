<template>
  <v-app :theme="theme">
    <!-- Górny pasek nawigacyjny -->
    <v-app-bar color="primary" dark>
      <v-container class="d-flex align-center">
        <v-app-bar-title>📋 Lista Obecności</v-app-bar-title>
        <v-spacer></v-spacer>

        <v-btn icon @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-moon-waxing-crescent' }}</v-icon>
        </v-btn>

        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Nawigacja boczna (drawer) -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-home" title="Strona główna"></v-list-item>
        <v-list-item to="/teacher-scanner" prepend-icon="mdi-qrcode-scan" title="Skaner"></v-list-item>
        <v-list-item to="/student-register" prepend-icon="mdi-cellphone" title="Rejestracja urządzenia"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Główna zawartość strony -->
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Stopka -->
    <v-footer app class="text-center">
      <v-container>
        <span>&copy; {{ new Date().getFullYear() }} AttendMe - System obecności</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';

export default {
  name: 'App',
  setup() {
    const drawer = ref(false);
    const theme = useTheme();
    const isDark = computed(() => theme.global.current.value === 'dark');

    const toggleTheme = () => {
      theme.global.current.value = isDark.value ? 'light' : 'dark';
    };

    return { drawer, theme, isDark, toggleTheme };
  },
};
</script>

<style>
.v-main {
  min-height: 100vh;
}
</style>
