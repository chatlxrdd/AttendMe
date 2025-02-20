<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/api/backend";
import QrcodeVue from "qrcode.vue";
import router from "@/router";

const authTokenDevice = ref<string>("");
const tokenregister = async () => {
    const response = await apiClient.get(
        "/user/attendance/ticket/get", { 
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authDevice")}`
        }
    }
)
    authTokenDevice.value = response.data.token
    console.log(response.data.token)
}
const goBack = () => {
  router.push("/student");
};

onMounted(tokenregister)
console.log(authTokenDevice.value)
</script>
<template>
    <div class="scanner-container">
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Skaner obecności</h2>
                </div>
                <div class="modal-body">
                    <div class="qr-container">
                        <qrcode-vue :value="authTokenDevice" :size="250" level="M"></qrcode-vue>
                       

                    </div>
                    <button @click="goBack">KURWYYYYYYYYYYYYYYYYYYYYYYYYY!!!!!!!!!!!!!!!!</button>
                </div>
            </div>
        </div>
    </div>
</template>