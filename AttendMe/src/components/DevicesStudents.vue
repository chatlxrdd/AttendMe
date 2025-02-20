<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import apiClient from "@/api/backend";

interface Student {
  attenderUserId: number;
  userName: string;
  userSurname: string;
  studentAlbumIdNumber: number;
}

interface UserDevice {
  userId: number;
  deviceName?: string;
}

const props = defineProps<{ students: Student[] }>();

const isOpen = ref(false);
const usersDevices = ref<{ [key: number]: string }>({});
const registrationTokens = ref<{ [key: number]: string }>({});
const isLoading = ref(false);
const errorMessage = ref("");

const fetchUsersDevices = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  usersDevices.value = {};
  registrationTokens.value = {};

  try {
    const userIds = props.students.map(student => student.attenderUserId);

    if (userIds.length === 0) {
      errorMessage.value = "Brak użytkowników do wyświetlenia.";
      isLoading.value = false;
      return;
    }

    const devicePromises = userIds.map(userId =>
      apiClient.get<UserDevice>("/user/get", { params: { userId } })
    );

    const tokenPromises = userIds.map(userId =>
      apiClient.get<{ token: string }>("/user/device/register/token/get", { params: { deviceUserId: userId } })
    );

    const deviceResponses = await Promise.all(devicePromises);
    usersDevices.value = deviceResponses.reduce((acc, res) => {
      acc[res.data.userId] = res.data.deviceName || "-";
      return acc;
    }, {} as { [key: number]: string });

    const tokenResponses = await Promise.all(tokenPromises);
    registrationTokens.value = tokenResponses.reduce((acc, res, index) => {
      acc[userIds[index]] = res.data.token;
      return acc;
    }, {} as { [key: number]: string });

  } catch (error) {
    errorMessage.value = "Błąd pobierania danych użytkowników.";
    console.error("❌ Błąd pobierania danych:", error);
  } finally {
    isLoading.value = false;
  }
};

const copyRegisterLink = async (userId: number) => {
  if (!registrationTokens.value[userId]) return;

  const registerUrl = `${window.location.origin}/registerdevice/${registrationTokens.value[userId]}`;
  try {
    await navigator.clipboard.writeText(registerUrl);
  } catch (err) {
    console.error("❌ Błąd kopiowania linku:", err);
  }
};

const resetDevice = async (userId: number) => {
  if (!confirm("Czy na pewno chcesz zresetować urządzenie dla tego użytkownika?")) return;

  try {
    await apiClient.post("/user/device/reset", null, { 
      params: { deviceUserId: userId } 
    });
    alert("Urządzenie zostało zresetowane!");
    fetchUsersDevices(); // Odświeżamy tabelę po resecie
  } catch (error) {
    console.error("❌ Błąd resetowania urządzenia:", error);
    alert("Nie udało się zresetować urządzenia.");
  }
};

const openModal = () => {
  isOpen.value = true;
  fetchUsersDevices();
};

const closeModal = () => {
  isOpen.value = false;
};
</script>

<template>
  <div>
    <button class="open-devices-btn" @click="openModal">Zarejestrowane urządzenia</button>

    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Zarejestrowane urządzenia</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <p v-if="isLoading">Ładowanie danych...</p>
          <p v-if="errorMessage">{{ errorMessage }}</p>

          <table v-if="students.length">
            <thead>
              <tr>
                <th>Album</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Urządzenie</th>
                <th>Rejestracja</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.attenderUserId">
                <td>{{ student.studentAlbumIdNumber || "-" }}</td>
                <td>{{ student.userName }}</td>
                <td>{{ student.userSurname }}</td>
                <td>{{ usersDevices[student.attenderUserId] || "-" }}</td>
                <td>
                  <button class="copy-btn" @click="copyRegisterLink(student.attenderUserId)">Skopiuj link</button>
                </td>
                <td>
                  <button class="reset-btn" @click="resetDevice(student.attenderUserId)">Resetuj</button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else-if="!isLoading">Brak danych do wyświetlenia.</p>
        </div>

        <div class="modal-footer">
          <button class="close-footer-btn" @click="closeModal">Zamknij</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styl jak w skanerze obecności */
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
    max-width: 800px;
    padding: 20px;
    text-align: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

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

.close-btn {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    color: black;
}

th {
    background-color: #f4f4f4;
}

.copy-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
}

.copy-btn:hover {
    background: #218838;
}

.reset-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
}

.reset-btn:hover {
    background: #c82333;
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

.open-devices-btn {
    background: #1976D2;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1em;
}

.open-devices-btn:hover {
    background: #1565C0;
}
</style>
