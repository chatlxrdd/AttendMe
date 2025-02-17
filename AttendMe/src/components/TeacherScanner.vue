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

                    <!-- KOD QR -->
                    <v-card class="mx-auto d-flex justify-center pa-5">
                        <qrcode-vue :value="scannerUrl" size="250" level="M"></qrcode-vue>
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

<script>
import { ref, onMounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import apiClient from '../plugins/api';

export default {
    components: { QrcodeVue },
    setup() {
        const dialog = ref(false);
        const scannerUrl = ref('');
        const courseSessionId = ref(123); // 🛠️ Zmień na dynamiczne ID sesji

        // Pobierz token skanera z backendu
        const fetchScannerToken = async () => {
            try {
                const courseSessionId = 123; // Sprawdź, czy wartość jest poprawna
                const response = await apiClient.get('/course/session/attendance/scanner/token/get', {
                    params: { courseSessionId: courseSessionId }, // PRZEKAZANIE parametru w query
                    headers: { Accept: 'application/json' }, // Wymagany format odpowiedzi
                });

                if (response.data.token) {
                    scannerUrl.value = `https://attendme.runasp.net/#/scanner?token=${response.data.token}`;
                    console.log("🔹 Token pobrany:", response.data.token);
                } else {
                    console.error("❌ Błąd: Brak tokena w odpowiedzi.");
                }
            } catch (error) {
                console.error('❌ Błąd pobierania tokenu skanera:', error.response?.data || error.message);
            }
        };

        onMounted(fetchScannerToken);

        const copyUrl = () => {
            navigator.clipboard.writeText(scannerUrl.value)
                .then(() => console.log("📋 Adres skopiowany!"))
                .catch(err => console.error("❌ Błąd kopiowania adresu", err));
        };

        return { dialog, scannerUrl, copyUrl };
    }
};
</script>

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