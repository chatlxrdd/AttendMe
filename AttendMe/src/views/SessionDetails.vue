<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate, formatTime } from '@/utils/FormatDate.vue';
import apiClient from "@/api/backend";
import Scanner from "@/components/Scanner.vue";

interface SessionDetails {
  courseId: number;
  courseName: string;
  courseGroupId: number;
  courseGroupName: string;
  courseSessionId: number;
  locationName: string;
  dateStart: string;
  dateEnd: string;
}

interface Student {
  attenderUserId: number;
  userName: string;
  userSurname: string;
  studentAlbumIdNumber: number;
  wasUserPresent: boolean;
}

const route = useRoute();
const sessionId = ref(route.params.sessionId as string);
const sessionDetails = ref<SessionDetails | null>(null);
const students = ref<Student[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");

// 🔹 Pobieranie szczegółów zajęć
const fetchSessionDetails = async () => {
  try {
    const res = await apiClient.get<SessionDetails>("/course/teacher/session/get", {
      params: { sessionId: sessionId.value }
    });

    if (res.data) {
      sessionDetails.value = res.data;
    } else {
      throw new Error("Brak danych o sesji.");
    }
  } catch (error) {
    console.error("❌ Błąd pobierania szczegółów zajęć:", error);
    errorMessage.value = "Nie udało się pobrać szczegółów zajęć.";
  }
};

// 🔹 Pobieranie listy studentów
const fetchStudentList = async () => {
  try {
    const res = await apiClient.get<Student[]>("/course/session/attendance-list/get", {
      params: { sessionId: sessionId.value }
    });

    if (res.data) {
      students.value = res.data;
    } else {
      throw new Error("Brak listy studentów.");
    }
  } catch (error) {
    console.error("❌ Błąd pobierania listy studentów:", error);
    errorMessage.value = "Nie udało się pobrać listy studentów.";
  }
};

// 🔹 Zmiana obecności studenta
const toggleAttendance = async (student: Student) => {
  try {
    await apiClient.get("/course/session/attendance/toggle", {
      params: {
        attendingUserId: student.attenderUserId,
        courseSessionId: sessionId.value,
        addOrRemove: !student.wasUserPresent
      }
    });

    await fetchStudentList();
  } catch (error) {
    console.error("❌ Błąd zmiany obecności:", error);
  }
};

// 🔹 Pobieranie danych po załadowaniu widoku
onMounted(async () => {
  isLoading.value = true;
  await fetchSessionDetails();
  await fetchStudentList();
  isLoading.value = false;
});
</script>

<template>
  <div class="session-details">
    <h1>Szczegóły zajęć</h1>

    <p v-if="isLoading">Ładowanie danych...</p>

    <div v-if="!isLoading && sessionDetails" class="session-info">
      <h2>{{ sessionDetails.courseName }}</h2>
      <p><strong>Grupa:</strong> {{ sessionDetails.courseGroupName }}</p>
      <p><strong>Data:</strong> {{ formatDate(sessionDetails.dateStart) }}</p>
      <p><strong>Godzina:</strong> {{ formatTime(sessionDetails.dateStart) }} - {{ formatTime(sessionDetails.dateEnd) }}</p>
      <p><strong>Sala:</strong> {{ sessionDetails.locationName }}</p>
      <Scanner :courseSessionId="Number(sessionId)" />
    </div>

    <h2>Lista studentów</h2>
    <table v-if="!isLoading && students.length">
        <thead>
        <tr>
          <th>Album</th>
          <th>Imię</th>
          <th>Nazwisko</th>
          <th>Status</th>
          <th>Akcja</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stu in students" :key="stu.attenderUserId">
          <td>{{ stu.studentAlbumIdNumber }}</td>
          <td>{{ stu.userName }}</td>
          <td>{{ stu.userSurname }}</td>
          <td :class="{ present: stu.wasUserPresent, absent: !stu.wasUserPresent }">
            {{ stu.wasUserPresent ? "Obecny" : "Nieobecny" }}
          </td>
          <td>
            <button @click="toggleAttendance(stu)">
              {{ stu.wasUserPresent ? "Oznacz jako nieobecny" : "Oznacz jako obecny" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <p v-else>Brak studentów na liście.</p>
  </div>
</template>

<style scoped>
.session-details {
  padding: 40px 20px;
  max-width: 800px;
  margin: auto;
  text-align: center;
  background-color: #181818;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1, h2 {
  margin-bottom: 10px;
  margin-top: 10px;
}

.session-info {
  background: #222;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  margin: 8px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #222;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  padding: 12px;
  text-align: center;
}

th {
  background: #007BFF;
  color: white;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background: #2a2a2a;
}

tbody tr:hover {
  background: #007BFF;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background 0.3s ease;
}

button:hover {
  background: #007BFF;
  color: white;
}

.present {
  color: #28a745;
  font-weight: bold;
}

.absent {
  color: #dc3545;
  font-weight: bold;
}
</style>