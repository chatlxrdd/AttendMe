<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/api/backend";
import QrcodeVue from "qrcode.vue";
import router from "@/router";

const checkDevice = ref<boolean>(false);
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
    checkDevice.value = true
}
const goBack = () => {
    router.back();
};

onMounted(tokenregister)
</script>
<template>
    <div class="scanner-container">
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Skaner obecności</h2>
                </div>
                <div class="modal-body">
                    <div class="qr-container" v-if="checkDevice">
                        <qrcode-vue :value="authTokenDevice" :size="250" level="M"></qrcode-vue>
                    </div>
                    <p v-if="!checkDevice">Najpierw zarejestruj urządzenie</p>
                    <button @click="goBack">Powrót</button>
                </div>
            </div>
        </div>
    </div>
</template>