<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted, watch, computed } from "vue";
import { decodeJwt } from '@/utils/UtilScripts';
import apiClient from '@/api/backend';

const authStore = useAuthStore();
const token = ref<string | null>(null);
const name = ref<string | null>(null);
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLoading = ref<boolean>(false);

const loadName = async () => {
  token.value = localStorage.getItem("token");
  if (!token.value) { return }
  isLoading.value = true;
  const userId = decodeJwt(token.value).sub;
  const res = await apiClient.get(`/user/get?userId=${userId}`);
  name.value = res.data.name;
  isLoading.value = false;
}

onMounted(loadName);
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    loadName()
  } else {
    name.value = null
  }
})
</script>

<template>
  <nav class="navbar" v-if="!isLoading">
    <p v-if="authStore.isAuthenticated">Witaj {{ name }}</p>
    <router-link v-if="authStore.isAuthenticated && authStore.role === 'student'" to="/student">Strona główna</router-link>
    <router-link v-if="authStore.isAuthenticated && authStore.role === 'teacher'" to="/teacher">Strona główna</router-link>
    <div class="user-info">
      <button v-if="authStore.isAuthenticated" class="logout-btn" @click="authStore.logout();">Wyloguj</button>
    </div>
  </nav>
</template>
 
  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    padding: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .logout-btn {
    background: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
  }
  
  .logout-btn:hover {
    background: #c82333;
  }
  </style>
  