<script setup lang="ts">
import { ref, onMounted } from "vue";
import QrcodeVue from "qrcode.vue";
import apiClient from "@/api/backend";
//import "@/assets/scanner.css"; // 🔹 Import pliku ze stylami


const baseUrl = "https://attendme-backend.runasp.net";
const props = defineProps<{ courseSessionId: number }>();
const dialog = ref(false);
const scannerUrl = ref<string>("");

// 🔹 Pobierz token skanera z backendu
const fetchScannerToken = async () => {
    try {
        const response = await apiClient.get<{ token: string }>(
            "/course/session/attendance/scanner/token/get", { 
                params: { courseSessionId: props.courseSessionId }
            }
        );

        if (response.data?.token) {
            scannerUrl.value = `${baseUrl}/scanner/scannerToken?=${response.data.token}`;
        } else {
            throw new Error("Brak tokena skanera w odpowiedzi.");
        }
    } catch (error) {
        console.error("❌ Błąd pobierania tokenu skanera:", error);
    }
};

// 🔹 Skopiuj URL do schowka
const copyUrl = () => {
    navigator.clipboard.writeText(scannerUrl.value)
        .catch(err => console.error("❌ Błąd kopiowania adresu skanera", err));
};
onMounted(fetchScannerToken);

</script>

<template>
    <div class="scanner-container">
        <button class="open-scanner-btn" @click="dialog = true">Skaner obecności</button>

        <div v-if="dialog" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Skaner obecności</h2>
                    <button class="close-btn" @click="dialog = false">&times;</button>
                </div>
                <div class="modal-body">
                    <p>
                        Do sprawdzania obecności wymagane jest urządzenie wyposażone w kamerę (tablet lub telefon).
                        Zeskanuj kod QR lub otwórz adres URL, który możesz skopiować poniższym przyciskiem.
                    </p>
                    <div class="qr-container">
                        <qrcode-vue :value="scannerUrl" :size="250" level="M"></qrcode-vue>
                    </div>
                    <input class="scanner-url" v-model="scannerUrl" readonly />
                    <button class="copy-btn" @click="copyUrl">Skopiuj adres</button>
                </div>
                <div class="modal-footer">
                    <button class="close-footer-btn" @click="dialog = false">Zamknij</button>
                </div>
            </div>
        </div>
    </div>
</template>