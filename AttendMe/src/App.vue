<script setup lang="ts">


// poprostu to zakomentuj wszystko XD
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
    router.push("/student/dashboard");
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
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
    <p>Sprawdź konsolę, aby zobaczyć wynik testu połączenia z backendem.</p>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>