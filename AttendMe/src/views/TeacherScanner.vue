<script setup lang="ts">
import { ref, onMounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import apiClient from "@/api/backend";

interface AuthResponse {
    token: string;
}

const dialog = ref(false);
const scannerUrl = ref<string>(''); // 🚀 Typowanie jako string
const courseSessionId = ref<number>(123); // 🔹 Zapewnienie, że to liczba

const loginData = {
    loginName: "pk",
    password: "123#Asd",
};

// 🔹 Pobierz token skanera z backendu
const fetchScannerToken = async (): Promise<string | null> => {
    try {
        const response = await apiClient.post<AuthResponse>(
            "/user/login",
            null,
            {
                params: loginData,
                headers: { "Accept": "text/plain" },
            }
        );

        if (response.data?.token) {
            console.log("✅ Zalogowano! Otrzymany token:", response.data.token);
            localStorage.setItem("token", response.data.token);
            scannerUrl.value = `https://example.com/scanner?token=${response.data.token}`; // 🔹 Przykładowy URL
            return response.data.token;
        } else {
            throw new Error("Brak tokena w odpowiedzi.");
        }
    } catch (error) {
        console.error("❌ Błąd logowania:", error.response?.data || error.message);
        return null;
    }
};

onMounted(fetchScannerToken);

// 🔹 Funkcja kopiowania URL do schowka
const copyUrl = () => {
    navigator.clipboard.writeText(scannerUrl.value)
        .then(() => console.log("📋 Adres skopiowany!"))
        .catch(err => console.error("❌ Błąd kopiowania adresu", err));
};
</script>

<template>
    <v-container class="d-flex justify-center">
        <v-btn color="primary" large @click="dialog = true">
            Skaner obecności
        </v-btn>

        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between">
                    Skaner obecności
                    <v-btn icon @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <p>
                        Do sprawdzania obecności wymagane jest urządzenie wyposażone w kamerę (tablet lub telefon).
                        Zeskanuj kod QR lub otwórz adres URL, który możesz skopiować poniższym przyciskiem.
                    </p>

                    <!-- 🔹 KOD QR -->
                    <v-card class="mx-auto d-flex justify-center pa-5">
                        <qrcode-vue :value="scannerUrl" :size="250" level="M"></qrcode-vue>
                        <!-- ✅ Upewnij się, że size jest liczbą -->
                    </v-card>

                    <v-text-field v-model="scannerUrl" readonly label="Adres skanera"></v-text-field>
                    <v-btn color="black" variant="outlined" @click="copyUrl">
                        Skopiuj adres
                    </v-btn>
                </v-card-text>

                <v-card-actions class="d-flex justify-center">
                    <v-btn color="grey darken-1" @click="dialog = false">
                        Zamknij
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
.v-card {
    padding: 15px;
}

.v-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
}
</style>