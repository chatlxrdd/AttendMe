<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/backend";

interface AttendanceRecord {
  attendanceLogId: number;
  attenderUserId: number;
  courseSessionId: number;
  dateCreated: string;
}

const route = useRoute();
const router = useRouter();
const sessionDetails = ref(null);
const attendanceLog = ref<AttendanceRecord[]>([]);
const courseGroupId = Number(route.params.id);

const fetchSessionDetails = async () => {
  try {
    const sessionResponse = await apiClient.get(`/course/student/group/sessions/get`, {
      params: { courseGroupId }
    });
    sessionDetails.value = sessionResponse.data;

    const attendanceResponse = await apiClient.get(`/course/student/attendance/get`, {
      params: { courseGroupId }
    });

    if (Array.isArray(attendanceResponse.data)) {
      attendanceLog.value = attendanceResponse.data as AttendanceRecord[];
    } else if (attendanceResponse.data !== null && typeof attendanceResponse.data === "object") {
      attendanceLog.value = [attendanceResponse.data as AttendanceRecord];
    } else {
      console.error("Błąd: Oczekiwano tablicy lub obiektu, otrzymano:", attendanceResponse.data);
    }
  } catch (error) {
    console.error("Błąd pobierania szczegółów zajęć", error);
  }
};

const goToAttendance = () => {
  router.push(`/student/attendance/${courseGroupId}`);
};

onMounted(fetchSessionDetails);
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold">Szczegóły zajęć</h1>
    
    <div v-if="sessionDetails">
      <p><strong>Przedmiot:</strong> {{ sessionDetails.courseName }}</p>
      <p><strong>Grupa:</strong> {{ sessionDetails.groupName }}</p>
      <p><strong>Data:</strong> {{ sessionDetails.startTime }}</p>
    </div>

    <h2 class="mt-4 text-lg font-bold">Twoja frekwencja</h2>
    <ul>
      <li v-for="log in attendanceLog" :key="log.attendanceLogId">
        {{ log.dateCreated }} - Sesja ID: {{ log.courseSessionId }}
      </li>
    </ul>

    <button @click="goToAttendance" class="mt-4 bg-green-500 text-white px-3 py-1 rounded">
      Rejestruj obecność
    </button>
  </div>
</template>
