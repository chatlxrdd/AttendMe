<script setup>
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import { onMounted } from "vue";
import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";

const testLogin = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/login`, 
      null,  // Brak body, parametry prześlemy w URL
      {
        params: {
          loginName: "stu14748",
          password: "14748"
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