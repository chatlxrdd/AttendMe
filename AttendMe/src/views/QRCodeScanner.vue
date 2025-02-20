<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import QrScanner from "qr-scanner";
import apiClient from "@/api/backend";
import "@/assets/scanner.css"; // 🔹 Import pliku ze stylami

const videoElement = ref<HTMLVideoElement | null>(null);
const scanResult = ref<string>("");
const router = useRouter();
let qrScanner: QrScanner | null = null;

// 🔹 Sprawdź, czy użytkownik jest zalogowany
const checkIfLoggedIn = () => {
    if (!localStorage.getItem("token")) {
        console.log("❌ Nie jesteś zalogowany!");
        router.push("/login");
        return false;
    }
    console.log("✅ Jesteś zalogowany!");
    return true;
};

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
        const response = await apiClient.post(
            "/course/session/attendance/register",
            { token: qrToken },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
onMounted(() => {
    if (checkIfLoggedIn()) {
        startScanner();
    }
});

// 🔹 Zatrzymaj skaner po opuszczeniu komponentu
onUnmounted(stopScanner);
</script>

<template>
    <div class="scanner-container">
        <div class="header">
            <img src="@/assets/logo.png" alt="AttendMe Logo" class="logo" />
            <h1 class="title">Umieść wygenerowany kod QR w widoku kamery</h1>
            <p class="subtitle">Aby zarejestrować obecność, umieść wygenerowany kod QR w widoku kamery</p>
        </div>
        <video ref="videoElement" autoplay playsinline class="camera-view"></video>
        <div v-if="scanResult" class="scan-result">{{ scanResult }}</div>
    </div>
</template>