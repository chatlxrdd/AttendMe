<script setup lang="ts">
import { onMounted, ref } from 'vue';
import apiClient from "@/api/backend";

interface AuthResponse {
  token: string;
}

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
    alert("Niepoprawne dane logowania. Spróbuj ponownie.");
    return null;
  } finally {
    location.reload();
  }
};
// navbar
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

    <!-- Panel wykładowcy wyświetlany po poprawnym logowaniu -->
    <div v-if="isLogged" class="dashboard">
      <h3>Witamy, {{ username }}!</h3>
      <p>Jesteś zalogowany do panelu wykładowcy.</p>
      <!-- Tutaj możesz dodać dodatkowe elementy panelu -->
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #428bca;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #3071a9;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.dashboard {
  margin-top: 20px;
  padding: 15px;
  background-color: #f7f7f7;
  border-radius: 4px;
}
</style>
