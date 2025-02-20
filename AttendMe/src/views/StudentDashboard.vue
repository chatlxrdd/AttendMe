<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { formatDate, formatTime } from '@/utils/utilScripts.vue';
import apiClient from "../api/backend";

interface CourseSession {
  sessionId: number;
  courseName: string;
  dateStart: string;
  dateEnd: string;
  courseGroupName: string;
}

interface ApiResponse {
  items: CourseSession[];
}

const sessions = ref<CourseSession[]>([]);
const searchText = ref("");
const showPastSessions = ref(false);
const isLoading = ref(true);
const errorMessage = ref("");
const selectedDateRange = ref("week");

const getDateRanges = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    week: { dateStart: startOfWeek.toISOString(), dateEnd: endOfWeek.toISOString() },
    month: { dateStart: startOfMonth.toISOString(), dateEnd: endOfMonth.toISOString() },
    threeMonths: { dateStart: new Date(now.setMonth(now.getMonth() - 3)).toISOString(), dateEnd: null },
    all: { dateStart: null, dateEnd: null }
  };
};

const fetchStudentSessions = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    sessions.value = [];

    const dateRanges = getDateRanges();
    const selectedFilter = dateRanges[selectedDateRange.value];

    const response = await apiClient.post<ApiResponse>("/course/student/sessions/get", {
      pageNumber: 1,
      pageSize: 20,
      filters: {
        search: searchText.value || "",
        dateStart: selectedFilter.dateStart,
        dateEnd: selectedFilter.dateEnd
      },
      sortBy: "dateStart"
    });

    if (response.data && Array.isArray(response.data.items)) {
      sessions.value = response.data.items;
    } else {
      errorMessage.value = "Brak zajęć do wyświetlenia.";
    }
  } catch (error) {
    console.error("Błąd pobierania zajęć:", error);
    errorMessage.value = "Nie udało się załadować zajęć.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchStudentSessions);
</script>

<template>
  <div class="dashboard">
    <h1>Pulpit Studenta</h1>

    <div class="filters">
      <input v-model="searchText" type="text" placeholder="Szukaj zajęć..." @input="fetchStudentSessions" />
      <select v-model="selectedDateRange" @change="fetchStudentSessions">
        <option value="week">Ostatni tydzień</option>
        <option value="month">Ostatni miesiąc</option>
        <option value="threeMonths">Ostatnie 3 miesiące</option>
        <option value="all">Wszystko</option>
      </select>
      <button @click="showPastSessions = !showPastSessions; fetchStudentSessions()">
        {{ showPastSessions ? "Pokaż nadchodzące" : "Pokaż przeszłe" }}
      </button>
    </div>

    <p v-if="isLoading">Ładowanie zajęć...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <ul v-if="!isLoading && sessions.length">
      <li v-for="session in sessions" :key="session.sessionId">
        <strong>{{ session.courseName }}</strong> - 
        {{ formatDate(session.dateStart) }} - 
        {{ formatTime(session.dateStart) }} - 
        {{ formatTime(session.dateEnd) }} - 
        Grupa: {{ session.courseGroupName }}
      </li>
    </ul>

    <p v-else-if="!isLoading">Brak zajęć do wyświetlenia.</p>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  text-align: center;
  padding: 20px;
  background: #f0f4f8;
  border-radius: 10px;
  color: black;
}

.filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: black;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
  color: black;
}

li {
  background: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
