<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "@/api/backend";
import ClassCard from "@/components/ClassCard.vue";

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
const filterType = ref("week");

// Funkcja obliczania zakresów dat
const getDateRanges = () => {
  const now = new Date();

  // Tydzień w UTC
  const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay() + 1, 0, 0, 0, 0));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  // Miesiąc w UTC
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  return {
    week: { dateStart: startOfWeek.toISOString(), dateEnd: endOfWeek.toISOString() }, // Ten tydzień
    month: { dateStart: startOfMonth.toISOString(), dateEnd: endOfMonth.toISOString() }, // Ten miesiąc
    future: { dateStart: now.toISOString(), dateEnd: null }, // Przyszłe zajęcia
    all: { dateStart: null, dateEnd: null } // Wszystkie zajęcia
  };
};

// Funkcja do pobierania zajęć wykładowcy
const fetchClasses = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const dateRanges = getDateRanges();
    const selectedFilter = dateRanges[filterType.value]; // Pobieramy odpowiedni zakres dat

    const res = await apiClient.post<ApiResponse>("/course/teacher/sessions/get", {
      pageNumber: 1,
      filters: {
        dateStart: selectedFilter.dateStart,
        dateEnd: selectedFilter.dateEnd,
      },
      sortBy: "dateStart"
    });

    if (res.data && Array.isArray(res.data.items)) {
      classes.value = res.data.items;
    } else {
      throw new Error("Brak danych w odpowiedzi.");
    }
  } catch (error) {
    console.error("❌ Błąd pobierania zajęć:", error);
  } finally {
    isLoading.value = false;
  }
};

// Zmiana filtra
const changeFilter = () => {
  fetchClasses();
};

// Pobieranie zajęć po załadowaniu strony
onMounted(fetchClasses);
</script>

<template>
  <div class="dashboard">
    <h1>Pulpit wykładowcy</h1>

    <!--  Select do wyboru filtrowania zajęć -->
    <label for="filter">Pokaż:</label>
    <select id="filter" v-model="filterType" @change="changeFilter">
      <option value="week">Ten Tydzień</option>
      <option value="month">Ten Miesiąc</option>
      <option value="future">Przyszłe</option>
      <option value="all">Wszystkie</option>
    </select>

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
/* 🔹 Styl dla całej strony */
.dashboard {
  padding: 40px 20px;
  max-width: 1200px;
  margin: auto;
  text-align: center;
  background-color: #181818; /* Ciemne tło */
  color: #ffffff; /* Białe napisy */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 🔹 Nagłówek */
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 🔹 Styl dla selektora */
label {
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 10px;
}

select {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #007BFF;
  border-radius: 8px;
  background: #1e1e1e;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
}

select:hover {
  background: #007BFF;
  color: white;
}

/* 🔹 Styl dla tabeli */
table {
  width: 80%;
  border-collapse: collapse;
  background: #222;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 20px;
}

th, td {
  white-space: nowrap;
  padding: 15px;
  text-align: center;
}

th {
  background: #007BFF;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

tbody tr:nth-child(even) {
  background: #2a2a2a;
}

tbody tr:hover {
  background: #007BFF;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

/* 🔹 Dostosowanie dla responsywności */
@media (max-width: 768px) {
  table {
    width: 100%;
  }

  select {
    width: 100%;
    padding: 12px;
  }
}
</style>
