<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/api/backend";

interface AuthResponse {
  token: string;
}

interface Class {
  id: number;
  name: string;
}

const classes = ref<Class[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");

// Dane logowania na sztywno
const loginData = {
  loginName: "pk",
  password: "123#Asd",
};

// Funkcja logowania
const loginAndGetToken = async (): Promise<string | null> => {
  try {
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

// Funkcja do pobierania zajęć wykładowcy
const fetchClasses = async () => {
  try {
    let token; // = localStorage.getItem("token")

    if (!token) {
      token = await loginAndGetToken();
      if (!token) throw new Error("Nie udało się uzyskać tokena.");
    }

    const res = await apiClient.get<Class[]>("/api/teacher/classes");
    classes.value = res.data;
  } catch (error) {
    console.error("Błąd podczas pobierania zajęć:", error);
    errorMessage.value = "Nie udało się załadować zajęć.";
  } finally {
    isLoading.value = false;
  }
};

// Automatyczne logowanie i pobieranie zajęć po załadowaniu strony
onMounted(fetchClasses);
</script>

<template>
  <div class="dashboard">
    <h1>Pulpit wykładowcy</h1>

    <p v-if="isLoading">Ładowanie zajęć...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <ul v-if="!isLoading && classes.length">
      <li v-for="cls in classes" :key="cls.id">
        <router-link :to="'/class/' + cls.id">{{ cls.name }}</router-link>
      </li>
    </ul>

    <p v-else-if="!isLoading && classes.length === 0">Brak zajęć do wyświetlenia.</p>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
a {
  text-decoration: none;
  color: blue;
}
</style>
