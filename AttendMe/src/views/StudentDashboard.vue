<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";
const router = useRouter();
const sessions = ref<CourseSession[]>([]);
const searchText = ref("");
const showPastSessions = ref(false); // Czy pokazać wcześniejsze zajęcia?

interface CourseSession {
  sessionId: number;
  courseName: string;
  startTime: string;
  attendanceStatus: string;
}

interface CourseSessionList {
  items: CourseSession[];
}

const fetchStudentSessions = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post<CourseSessionList>(
      `${API_BASE_URL}/course/student/sessions/get`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          pageNumber: 1,
          pageSize: 999999,
        }
      }
    );

    // Przetwarzamy listę zajęć i sortujemy
    sessions.value = response.data.items.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  } catch (error) {
    console.error("Błąd pobierania zajęć", error);
  }
};

// 🔹 Funkcja filtrowania według daty
const filteredSessions = computed(() => {
  const now = new Date();
  return sessions.value.filter(session => {
    const sessionDate = new Date(session.startTime);
    return showPastSessions.value ? sessionDate < now : sessionDate >= now;
  });
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(fetchStudentSessions);
</script>

<template>
  <div class="dashboard-container">
    <h1>Pulpit Studenta</h1>
    
    <input v-model="searchText" type="text" placeholder="Szukaj zajęć..." class="input-field" />
    
    <!-- 🔹 Przycisk do przełączania między przeszłymi a przyszłymi zajęciami -->
    <button @click="showPastSessions = !showPastSessions" class="toggle-button">
      {{ showPastSessions ? "Pokaż nadchodzące" : "Pokaż przeszłe" }}
    </button>

    <button @click="logout" class="logout-button">Wyloguj</button>

    <div class="session-list">
      <div v-for="session in filteredSessions" :key="session.sessionId" class="session-card">
        <h3>{{ session.courseName }}</h3>
        <p>Data: {{ new Date(session.startTime).toLocaleString() }}</p>
        <p>Status: {{ session.attendanceStatus }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.input-field {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.toggle-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.logout-button {
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.session-list {
  margin-top: 20px;
}

.session-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
