<script setup lang="ts">
import { ref } from "vue";
import apiClient from "@/api/backend"; // 🔹 Import klienta API

// 🔹 Definiowanie zmiennych reaktywnych dla formularza
const deviceName = ref("");
const studentName = ref("");
const studentSurname = ref("");
const albumNumber = ref("");
const message = ref("");
const messageType = ref("success");
const valid = ref<boolean>(false); // ✅ Typowanie poprawione
const form = ref<any>(null); // ✅ Ref formularza

// 🔹 Reguły walidacji dla pól
const required = (value: string) => !!value || "Pole jest wymagane";
const numberRule = (value: string) => /^\d+$/.test(value) || "Numer albumu musi być liczbą";

// 🔹 Funkcja rejestracji urządzenia zgodnie z API Swagger
const registerDevice = async () => {
    if (!form.value) return; // ✅ Upewnienie się, że form istnieje

    const { valid: isValid } = await form.value.validate(); // ✅ Pobranie statusu walidacji

    if (!isValid) {
        message.value = "❌ Wszystkie pola są wymagane!";
        messageType.value = "error";
        return;
    }

    try {
        const response = await apiClient.post<{ token: string }>(
            "/user/device/register",
            {
                deviceName: deviceName.value,
                studentName: studentName.value,
                studentSurname: studentSurname.value,
                albumNumber: Number(albumNumber.value), // Konwersja na liczbę
            },
            {
                headers: { "Accept": "text/plain" }, // 🔹 Oczekujemy odpowiedzi jako tekst
            }
        );

        if (response.data?.token) {
            localStorage.setItem("deviceToken", response.data.token); // ✅ Zapisujemy token w LocalStorage
            message.value = "✅ Urządzenie zarejestrowane pomyślnie!";
            messageType.value = "success";
            console.log("🔹 Otrzymany token:", response.data.token);

            // ✅ Resetowanie formularza po rejestracji
            form.value.reset();
            form.value.resetValidation();
        } else {
            throw new Error("Brak tokena w odpowiedzi.");
        }
    } catch (error: any) {
        console.error("❌ Błąd rejestracji:", error.response?.data || error.message);
        message.value = error.response?.data?.details || "⚠️ Błąd rejestracji urządzenia";
        messageType.value = "error";
    }

    // 🔹 Czyszczenie komunikatu po 3 sekundach
    setTimeout(() => {
        message.value = "";
    }, 3000);
};
</script>

<template>
    <v-container class="d-flex justify-center">
        <v-card class="pa-5" max-width="500" elevation="5">
            <v-card-title class="text-h4 text-center font-weight-bold">
                Rejestracja urządzenia
            </v-card-title>
            <v-card-subtitle class="text-center">
                Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności. Uzupełnij poniższe dane i
                naciśnij przycisk "Rejestruj".
            </v-card-subtitle>

            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field v-model="deviceName" label="📱 Nazwa urządzenia" outlined required :rules="[required]"
                        density="comfortable"></v-text-field>

                    <v-text-field v-model="studentName" label="🧑 Twoje imię" outlined required :rules="[required]"
                        density="comfortable"></v-text-field>

                    <v-text-field v-model="studentSurname" label="👨‍🎓 Twoje nazwisko" outlined required
                        :rules="[required]" density="comfortable"></v-text-field>

                    <v-text-field v-model="albumNumber" label="🎓 Twój numer albumu" outlined required type="number"
                        :rules="[required, numberRule]" density="comfortable"></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn color="green darken-2" large @click="registerDevice" :disabled="!valid">
                    ✅ Zarejestruj
                </v-btn>
            </v-card-actions>

            <v-alert v-if="message" :type="messageType" class="mt-3 text-center">
                {{ message }}
            </v-alert>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
}

.v-card {
    width: 100%;
    max-width: 500px;
}
</style>
