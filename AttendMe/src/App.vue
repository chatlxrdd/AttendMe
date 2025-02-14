<script setup>
import { onMounted } from "vue";
import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";

const testLogin = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/login`, 
      null,
      {
        params: {
          loginName: "pk",
          password: "123#Asd"
        },
        headers: {
          "Accept": "text/plain"
        }
      }
    );

    if (response.data && response.data.token) {
      console.log("✅ Test zakończony sukcesem! Otrzymany token:", response.data.token);
    } else {
      console.error("❌ Test nieudany: Brak tokena w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd testu API:", error.response?.data || error.message);
  }
};


onMounted(async () => {
  await testLogin();
});
</script>

<template>
  <router-view />
</template>

