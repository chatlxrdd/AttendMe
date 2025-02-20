<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import apiClient from "../api/backend";

interface CourseSession {
  sessionId: number;
  courseName: string;
  dateStart: string;
  courseGroupName: string;
}

interface ApiResponse {
  items: CourseSession[];
}

const sessions = ref<CourseSession[]>([]);
const searchText = ref("");
const isLoading = ref(true);
const errorMessage = ref("");
const selectedDateRange = ref("week");
const router = useRouter();

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "Brak daty";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Niepoprawna data" : date.toLocaleString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDateRange = () => {
  const now = new Date();
  let dateStart: string | null = null;
  let dateEnd: string | null = new Date().toISOString();

  switch (selectedDateRange.value) {
    case "week":
      dateStart = new Date(now.setDate(now.getDate() - 7)).toISOString();
      break;
    case "month":
      dateStart = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      break;
    case "threeMonths":
      dateStart = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      break;
    case "all":
      dateStart = null;
      dateEnd = null;
      break;
  }
  return { dateStart, dateEnd };
};

const fetchStudentSessions = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    sessions.value = [];

    const { dateStart, dateEnd } = getDateRange();

    const response = await apiClient.post<ApiResponse>("/course/student/sessions/get", {
      pageNumber: 1,
      pageSize: 20,
      filters: {
        search: searchText.value || "",
        dateStart,
        dateEnd
      },
      sortBy: "dateStart"
    });

    if (response.data && Array.isArray(response.data.items)) {
      sessions.value = response.data.items.map(session => ({
        ...session,
        dateStart: formatDateTime(session.dateStart)
      })).sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
    } else {
      errorMessage.value = "Brak zajęć do wyświetlenia.";
    }
  } catch (error) {
    errorMessage.value = "Nie udało się załadować zajęć.";
  } finally {
    isLoading.value = false;
  }
};

const filteredSessions = computed(() =>
  sessions.value.filter(session => session.courseName.toLowerCase().includes(searchText.value.toLowerCase()))
);

const goToSessionDetails = (sessionId: number) => {
  router.push(`/session/${sessionId}`);
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
    </div>

    <p v-if="isLoading">Ładowanie zajęć...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <ul v-if="!isLoading && filteredSessions.length">
      <li v-for="session in filteredSessions" :key="session.sessionId" @click="goToSessionDetails(session.sessionId)" class="clickable">
        <strong>{{ session.courseName }}</strong> - 
        {{ session.dateStart }} - 
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
  font-family: Arial, sans-serif;
}

.filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
  border: 1px solid #333;
  border-radius: 5px;
  font-size: 16px;
  color: black;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  cursor: pointer;
  color: black;
}

li:hover {
  background: #e0e0e0;
}
</style>
