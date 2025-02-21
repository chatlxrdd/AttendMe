<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { decodeJwt } from '@/utils/UtilScripts';
import apiClient, { AuthResponse } from '@/api/backend';
import AttendanceQrButton from "@/components/AttendanceQrButton.vue";
import '@/assets/login.css';

const authStore = useAuthStore();
const router = useRouter();
const username = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");

const login = () => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeJwt(token);
  const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role === "teacher") {
    authStore.login('teacher');
    router.push("/teacher");
  } else if (role === "student") {
    authStore.login('student');
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
      login();
    } else {
      throw new Error("Brak tokena w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd logowania:", error.response?.data || error.message);
    alert("Niepoprawne dane logowania. Spróbuj ponownie.");
  }
};
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
    <AttendanceQrButton />
  </div>
</template>

