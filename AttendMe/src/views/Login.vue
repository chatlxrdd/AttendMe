<script setup lang="ts">
import { onMounted, ref } from 'vue';
import apiClient, { AuthResponse } from '@/api/backend';
import router from '@/router';
import { decodeJwt } from '@/utils/UtilScripts.vue';
import '@/assets/login.css';

const username = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");

const redirectToDashboard = (token: string) => {
  const decodedToken = decodeJwt(token);
  const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role === "teacher") {
    router.push("/teacher");
  } else if (role === "student") {
    router.push("/student");
  } else {
    console.error("❌ Nieznana rola:", role);
  }
};

const handleLogin = async () => {
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
      }
    );

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      location.reload();
    } else {
      throw new Error("Brak tokena w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd logowania:", error.response?.data || error.message);
    alert("Niepoprawne dane logowania. Spróbuj ponownie.");
  }
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    redirectToDashboard(token);
  }
});
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
      <button type="submit" >Zaloguj</button>
    </form>
  </div>
</template>

