<script setup lang="ts">
import { ref } from "vue";
import apiClient from "@/api/backend";
import "@/assets/register.css"; // 🔹 Importujemy zewnętrzny plik CSS

// 🔹 Zmienne formularza
const deviceName = ref("");
const studentName = ref("");
const studentSurname = ref("");
const albumNumber = ref("");
const message = ref("");
const messageType = ref("success");

// 🔹 Funkcja walidacji formularza
const validateForm = () => {
    if (!deviceName.value || !studentName.value || !studentSurname.value || !albumNumber.value) {
        message.value = "❌ Wszystkie pola są wymagane!";
        messageType.value = "error";
        return false;
    }
    return true;
};

// 🔹 Funkcja rejestracji urządzenia
const registerDevice = async () => {
    if (!validateForm()) return;

    try {
        const response = await apiClient.post<{ token: string }>(
            "/user/device/register",
            {
                deviceName: deviceName.value,
                studentName: studentName.value,
                studentSurname: studentSurname.value,
                albumNumber: Number(albumNumber.value),
            },
            {
                headers: { "Accept": "text/plain" },
            }
        );

        if (response.data?.token) {
            localStorage.setItem("deviceToken", response.data.token);
            message.value = "✅ Urządzenie zarejestrowane pomyślnie!";
            messageType.value = "success";
            console.log("🔹 Otrzymany token:", response.data.token);

            // Reset formularza
            deviceName.value = "";
            studentName.value = "";
            studentSurname.value = "";
            albumNumber.value = "";
        } else {
            throw new Error("Brak tokena w odpowiedzi.");
        }
    } catch (error: any) {
        console.error("❌ Błąd rejestracji:", error.response?.data || error.message);
        message.value = error.response?.data?.details || "⚠️ Błąd rejestracji urządzenia";
        messageType.value = "error";
    }

    // 🔹 Komunikat znika po 3 sekundach
    setTimeout(() => {
        message.value = "";
    }, 3000);
};
</script>

<template>
    <div class="container">


        <h1 class="title">Rejestracja urządzenia</h1>
        <p class="subtitle">
            Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności. Uzupełnij poniższe dane
            i naciśnij przycisk "Rejestruj".
        </p>

        <form @submit.prevent="registerDevice" class="form">
            <label class="input-label">Nazwa urządzenia</label>
            <input v-model="deviceName" type="text" placeholder="Wprowadź nazwę urządzenia" class="input-field"
                required />

            <label class="input-label">Twoje imię</label>
            <input v-model="studentName" type="text" placeholder="Wprowadź swoje imię" class="input-field" required />

            <label class="input-label">Twoje nazwisko</label>
            <input v-model="studentSurname" type="text" placeholder="Wprowadź swoje nazwisko" class="input-field"
                required />

            <label class="input-label">Twój numer albumu</label>
            <input v-model="albumNumber" type="number" placeholder="Wprowadź numer albumu" class="input-field"
                required />

            <button type="submit" class="submit-btn">Zarejestruj</button>
        </form>

        <div v-if="message" :class="['message', messageType === 'success' ? 'success' : 'error']">
            {{ message }}
        </div>
    </div>
</template>