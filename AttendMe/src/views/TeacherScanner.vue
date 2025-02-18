<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import QrcodeVue from "qrcode.vue";
import apiClient from "@/api/backend";
import "@/assets/scanner.css"; // 🔹 Import pliku ze stylami
interface AuthResponse {
  token: string;
}
// 🔹 Zmienne komponentu
const baseUrl = "https://attendme-backend.runasp.net";
const dialog = ref(false);
const scannerUrl = ref<string>("");
const courseSessionId = ref<number>(1);
const router = useRouter();


// 🔹 Sprawdz czy zalogowany 



// 🔹 Pobierz token skanera z backendu
const fetchScannerToken = async () => {
    try {
        const response = await apiClient.get<{ token: string }>(

            "/course/session/attendance/scanner/token/get",
            { 
                params: { courseSessionId: courseSessionId.value },
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            }
            
        );

        if (response.data?.token) {
            console.log("✅ Token pobrany:", response.data.token);

            scannerUrl.value = `${baseUrl}/course/session/attendance/register/attenderToken?=${response.data.token}`;
            console.log("🔹 Adres URL skanera:", scannerUrl.value);
        } else {
            throw new Error("Brak tokena w odpowiedzi.");
        }
    } catch (error) {
        console.error("❌ Błąd pobierania tokenu:", error);
    }
};
const checkIfLoggedIn = () => {
    if (localStorage.getItem("token") === null) {
        console.log("❌ Nie jesteś zalogowany!");
        router.push("/login");
        return false;
    } else {
        console.log("✅ Jesteś zalogowany!");
        fetchScannerToken();
        return true;
    }
}

//Hardcoded Login
// check if logged in


// 🔹 Skopiuj URL do schowka
const copyUrl = () => {
    navigator.clipboard.writeText(scannerUrl.value)
        .then(() => console.log("📋 Adres skopiowany!"))
        .catch(err => console.error("❌ Błąd kopiowania", err));
};
onMounted(checkIfLoggedIn)

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