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
                    <v-text-field v-model="deviceName" label="Nazwa urządzenia" outlined required></v-text-field>
                    <v-text-field v-model="firstName" label="Twoje imię" outlined required></v-text-field>
                    <v-text-field v-model="lastName" label="Twoje nazwisko" outlined required></v-text-field>
                    <v-text-field v-model="studentId" label="Twój numer albumu" outlined required></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn color="green darken-2" large @click="registerDevice" :disabled="!valid">
                    Zarejestruj
                </v-btn>
            </v-card-actions>

            <v-alert v-if="message" :type="messageType" class="mt-3 text-center">
                {{ message }}
            </v-alert>
        </v-card>
    </v-container>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const deviceName = ref('');
        const firstName = ref('');
        const lastName = ref('');
        const studentId = ref('');
        const message = ref('');
        const messageType = ref('success');
        const valid = ref(false); // Sprawdza czy formularz jest poprawnie wypełniony

        const registerDevice = async () => {
            if (!deviceName.value || !firstName.value || !lastName.value || !studentId.value) {
                message.value = 'Wszystkie pola są wymagane!';
                messageType.value = 'error';
                return;
            }

            try {
                const response = await axios.post(
                    'https://attendme-backend.runasp.net/api/device/register',
                    {
                        deviceName: deviceName.value,
                        firstName: firstName.value,
                        lastName: lastName.value,
                        studentId: studentId.value,
                    }
                );
                message.value = 'Urządzenie zostało zarejestrowane!';
                messageType.value = 'success';
            } catch (error) {
                message.value = 'Błąd rejestracji urządzenia';
                messageType.value = 'error';
            }

            setTimeout(() => {
                message.value = '';
            }, 3000);
        };

        return {
            deviceName,
            firstName,
            lastName,
            studentId,
            registerDevice,
            message,
            messageType,
            valid,
        };
    },
};
</script>

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