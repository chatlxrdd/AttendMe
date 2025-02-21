<script setup lang="ts">
import { ref, onMounted } from "vue";
import QrcodeVue from "qrcode.vue";
import apiClient from "@/api/backend";


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
            scannerUrl.value = `${window.location.origin}/scanner/${response.data.token}`;
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

<style scoped>
/* Modalne okno */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    padding: 20px;
    text-align: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

/* Nagłówek modalnego okna */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #443a3a;
    padding-bottom: 10px;
    color: black;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.4em;
    font-weight: bold;
}

/* Przycisk zamykania */
.close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
}

/* Opis */
.modal-body p {
    font-size: 0.95em;
    color: #333;
    margin-bottom: 15px;
}

/* Sekcja QR */
.qr-container {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

/* Pole URL */
.scanner-url {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: center;
}

/* Przycisk kopiowania */
.copy-btn {
    background: #333;
    color: white;
    border: none;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

.copy-btn:hover {
    background: #222;
}

/* Stopka modalnego okna */
.modal-footer {
    margin-top: 15px;
}

.close-footer-btn {
    background: #666;
    color: white;
    border: none;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
}

.close-footer-btn:hover {
    background: #444;
}

/* Przycisk otwierający skaner */
.open-scanner-btn {
    background: #1976D2;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1em;
}

.open-scanner-btn:hover {
    background: #1565C0;
}

</style>