<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '@/router';
import apiClient from './api/backend';

interface AuthResponse {
  token: string;
};

const decodeJwt = (token: string): any => {
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
};
const getRoleFromToken = (token: string): string => {
  const decodedToken = decodeJwt(token);
  return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

const redirectToDashboard = (role: string) => {
  if (role === "teacher") {
    router.push("/teacher");
  } else if (role === "student") {
    router.push("/student");
  } else {
    console.error("❌ Nieznana rola:", role);
  }
};


const ifTokenExists = () => {
  const token = localStorage.getItem("token");
  if (token !== null) { 
    redirectToDashboard(getRoleFromToken(token));
    console.log(`Znalezniono token, przekierowanie... `)
  } else {
    console.log("Brak tokena, zaloguj się.")
    router.push("/login");
  }
};

const ifTokenValid = async() => {
  try {
  const userId = decodeJwt(localStorage.getItem("token")!).sub;
  console.log(`Sprawdzanie tokena dla użytkownika o id: ${userId}`);
  const response = await apiClient.get<AuthResponse>(
      `/user/get?userId=${userId}`,
      null,
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) { // Ponowne logowanie
      console.log("❌ Token wygasł lub jest niepoprawny. Zaloguj się ponownie");
      localStorage.removeItem("token");
      router.push("/login");
    }
  } 
};

onMounted(ifTokenExists)
onMounted(ifTokenValid)

const time = ref<number>(60*1000)
setInterval(ifTokenValid, time.value);

</script>

<template>
  <router-view />
</template>