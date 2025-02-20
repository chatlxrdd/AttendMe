<script setup lang="ts">
import { onMounted, ref } from 'vue';
import apiClient from "@/api/backend";
import router from '@/router';



const username = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");
const isLogged = ref<boolean>(false);


const handleLogin = async (): Promise<string | null> => {
  try {
    let loginData = {
  loginName: username.value,
  password: password.value
};
    const response = await apiClient.post<AuthResponse>(
      "/user/login",
      null,
      {
        params: loginData,
        headers: { "Accept": "text/plain" },
      }
    );

    if (response.data?.token) {
      console.log("✅ Zalogowano! Otrzymany token:", response.data.token);
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      throw new Error("Brak tokena w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd logowania:", error.response?.data || error.message);
    return null;
  }
};

// stworzyć sprazwdzanie czy logowanie jest przez studenta czy wykladowce
// jesli student to przekierowac na strone studenta
// jesli wykladowca to przekierowac na strone wykladowcy
// navbar z przyciskiem wyloguj i informacja o studencia
</script>

<template>
  <div class="login-container">
    <h2>Panel Logowania</h2>
    <!-- Formularz logowania -->
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Nazwa użytkownika:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Wpisz nazwę użytkownika"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Hasło:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Wpisz hasło"
          required
        />
      </div>
      <!-- Komunikat błędu -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit">Zaloguj</button>
    </form>

    <!-- Panel wykładowcy wyświetlany po poprawnym logowaniu -->
    <div v-if="isLogged" class="dashboard">
      <h3>Witamy, {{ username }}!</h3>
      <p>Jesteś zalogowany do panelu wykładowcy.</p>
      <!-- Tutaj możesz dodać dodatkowe elementy panelu -->
    </div>
  </div>
</template>


