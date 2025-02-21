<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { formatDate, formatTime } from '@/utils/UtilScripts';
import apiClient from "../api/backend";
import { useRoute, useRouter } from 'vue-router';
import '@/assets/StudentSessionDetails.css';
import AttendanceQrButton from "@/components/AttendanceQrButton.vue";

interface CourseSessionListItem {
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
  items: CourseSessionListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const route = useRoute();
const router = useRouter();
const sessionDetail = ref<CourseSessionListItem | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");

const fetchSessionDetails = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const sessionId = route.params.sessionId ? Number(route.params.sessionId) : null;
    if (!sessionId || isNaN(sessionId)) {
      errorMessage.value = "Niepoprawne ID sesji.";
      return;
    }

    const response = await apiClient.post<ApiResponse>(
      "/course/student/sessions/get",
      {
        pageNumber: 1,
        pageSize: 10,
        filters: { courseSessionId: sessionId },
        sortBy: "dateStart"
      }
    );
    
    if (response.data.items.length > 0) {
      sessionDetail.value = response.data.items[0];
    } else {
      errorMessage.value = "Brak zajęć dla tej sesji.";
    }
  } catch (error) {
    errorMessage.value = "Nie udało się załadować szczegółów zajęć.";
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push("/student");
};

watch(() => route.params.sessionId, fetchSessionDetails);

onMounted(fetchSessionDetails);
</script>

<template>
  <div class="session-details">
    <h1>Szczegóły Zajęć</h1>
    
    <p v-if="isLoading">Ładowanie...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <div v-if="sessionDetail">
      <h2>{{ sessionDetail.courseName }}</h2>
      <p>Grupa: {{ sessionDetail.courseGroupName }}</p>
      <p>Termin: {{ formatDate(sessionDetail.dateStart) }} {{ formatTime(sessionDetail.dateStart) }} - {{ formatTime(sessionDetail.dateEnd) }}</p>
      <p>Lokalizacja: {{ sessionDetail.locationName }}</p>
      <AttendanceQrButton />
      <button @click="goBack">Powrót</button>
    </div>
  </div>
</template>