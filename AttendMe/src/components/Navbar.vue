<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const token = ref<string | null>(null);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/"); 
};

onMounted(() => {
  token.value = localStorage.getItem("token");
});
</script>

<template>
  <nav v-if="token" class="navbar">
    <div class="user-info">
      <button @click="logout" class="logout-btn">Wyloguj</button>
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
  