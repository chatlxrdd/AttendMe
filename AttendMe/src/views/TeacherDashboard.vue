<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/api/backend";
import ClassCard from "@/components/ClassCard.vue";

interface AuthResponse {
  token: string;
}

interface CourseSession {
  courseId: number;
  courseName: string;
  courseGroupId: number;
  courseGroupName: string;
  courseSessionId: number;
  locationName: string;
  dateStart: string;
  dateEnd: string;
}

interface ApiResponse {
  items: CourseSession[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const classes = ref<CourseSession[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");

// Dane logowania na sztywno
const loginData = {
  loginName: "pk",
  password: "123#Asd",
};

// 🔹 Funkcja logowania
const loginAndGetToken = async (): Promise<string | null> => {
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
      return response.data.token;
    } else {
      throw new Error("Brak tokena w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd logowania:", error.response?.data || error.message);
    return null;
  }
};

// 🔹 Funkcja do pobierania zajęć wykładowcy
const fetchClasses = async () => {
  try {
    let token; // = localStorage.getItem("token")

    if (!token) {
      token = await loginAndGetToken();
      if (!token) throw new Error("Nie udało się uzyskać tokena.");
    }

    const res = await apiClient.post<ApiResponse>("/course/teacher/sessions/get", {
      pageNumber: 1,
      pageSize: 10,
      sortBy: "dateStart"
    }, {
      headers: { "Accept": "text/plain" },
    });

    if (res.data && Array.isArray(res.data.items)) {
      classes.value = res.data.items;
      console.log("✅ Pobrano wszystkie zajęcia:", res.data.items);
    } else {
      throw new Error("Brak danych w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd podczas pobierania zajęć:", error);
    errorMessage.value = "Nie udało się załadować zajęć.";
  } finally {
    isLoading.value = false;
  }
};

// 🔹 Automatyczne logowanie i pobieranie zajęć po załadowaniu strony
onMounted(fetchClasses);
</script>

<template>
  <div class="dashboard">
    <h1>Pulpit wykładowcy</h1>

    <p v-if="isLoading">Ładowanie zajęć...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <table v-if="!isLoading && classes.length">
      <thead>
        <tr>
          <th>Zajęcia</th>
          <th>Data</th>
          <th>Godzina</th>
          <th>Sala</th>
          <th>Grupa</th>
        </tr>
      </thead>
      <tbody>
        <ClassCard
          v-for="cls in classes"
          :key="cls.courseSessionId"
          :courseSessionId="cls.courseSessionId"
          :courseGroupName="cls.courseGroupName"
          :courseName="cls.courseName"
          :locationName="cls.locationName"
          :dateStart="cls.dateStart"
          :dateEnd="cls.dateEnd"
        />
      </tbody>
    </table>

    <p v-else-if="!isLoading && classes.length === 0">Brak zajęć do wyświetlenia.</p>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1000px;
  margin: auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  white-space: nowrap;
  padding: 12px;
  text-align: center;
}

th {
  background: #007BFF;
  color: white;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background: #f8f9fa;
}

tbody tr:hover {
  background: #dce9ff;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}
</style>
