<script setup lang="ts">

import { useRoute } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import QrScanner from "qr-scanner";
import apiClient from "@/api/backend";
//import "@/assets/scanner.css"; // 🔹 Import pliku ze stylami

const route = useRoute();
const tokenScanner = ref(route.params.tokenScanner as string);

console.log(tokenScanner.value)

const videoElement = ref<HTMLVideoElement | null>(null);
const scanResult = ref<string>("");
let qrScanner: QrScanner | null = null;

// 🔹 Uruchomienie skanera kodów QR
const startScanner = () => {
    if (videoElement.value) {
        qrScanner = new QrScanner(
            videoElement.value,
            (result) => {
                scanResult.value = result.data;
                console.log("✅ Kod QR zeskanowany:", result.data);
                registerAttendance(result.data); // Rejestracja obecności po zeskanowaniu
                stopScanner();
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        qrScanner.start();
    }
};

// 🔹 Rejestracja obecności na podstawie zeskanowanego QR
const registerAttendance = async (qrToken: string) => {
    try {
        const response = await apiClient.get(
            "/course/session/attendance/register",{ 
                params: { attenderToken: qrToken },
                headers: {
                    "Authorization": `Bearer ${tokenScanner.value}`,
                },
            }
        );

        if (!response.data) {
            throw new Error("❌ Nie udało się zarejestrować obecności.");
        }

        console.log("✅ Obecność zarejestrowana:", response.data);
        scanResult.value = "✅ Obecność zapisana!";
    } catch (error) {
        console.error("❌ Błąd rejestracji:", error);
        scanResult.value = "❌ Błąd rejestracji obecności.";
    }
};

// 🔹 Zatrzymanie skanera
const stopScanner = () => {
    if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
        qrScanner = null;
    }
};

// 🔹 Uruchom skaner po załadowaniu komponentu
onMounted(startScanner)



</script>
<template>
    <div class="scanner-container">
        <div class="header">

            <h1 class="title">Umieść wygenerowany kod QR w widoku kamery</h1>
            <p class="subtitle">Aby zarejestrować obecność, umieść wygenerowany kod QR w widoku kamery</p>
        </div>
        <video ref="videoElement" autoplay playsinline class="camera-view"></video>
        <div v-if="scanResult" class="scan-result">{{ scanResult }}</div>
    </div>
</template>
