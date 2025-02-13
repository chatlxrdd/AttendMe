<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";
const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");

interface TokenResponse {
  token: string;
}

const login = async () => {
  try {
    const response = await axios.post<TokenResponse>(
      `${API_BASE_URL}/user/login`,
      null,
      {
        params: {
          loginName: username.value,
          password: password.value
        },
        headers: {
          "Accept": "text/plain"
        }
      }
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      router.push("/student/dashboard");
    } else {
      errorMessage.value = "Nieprawidłowe dane logowania";
    }
  } catch (error) {
    errorMessage.value = "Błąd logowania. Sprawdź dane.";
  }
};
</script>

<template>
  <div class="login-container">
    <h1>Logowanie studenta</h1>
    <input v-model="username" type="text" placeholder="Login" class="input-field" />
    <input v-model="password" type="password" placeholder="Hasło" class="input-field" />
    <button @click="login" class="login-button">Zaloguj</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}

.input-field {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-button {
  background-color: #42b983;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
