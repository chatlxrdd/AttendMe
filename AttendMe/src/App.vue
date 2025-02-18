<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '@/router';

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
 }
onMounted(ifTokenExists);

</script>

<template>
  <router-view />
</template>