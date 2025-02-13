<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/api/backend";

interface CourseSession {
  sessionId: number;
  courseName: string;
  startTime: string;
  attendanceStatus: string;
}

interface CourseSessionList {
  items: CourseSession[];
}

const router = useRouter();
const sessions = ref<CourseSession[]>([]);
const searchText = ref("");

const fetchStudentSessions = async () => {
  try {
    const response = await apiClient.post<CourseSessionList>("/course/student/sessions/get", {
      pageNumber: 1,
      pageSize: 999999,
    });

    sessions.value = response.data.items;
  } catch (error) {
    console.error("Błąd pobierania zajęć", error);
  }
};

const filteredSessions = computed(() => {
  return sessions.value.filter(session => 
    session.courseName.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const goToDetails = (sessionId: number) => {
  router.push(`/student/course/${sessionId}`);
};

onMounted(fetchStudentSessions);
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold">Pulpit Studenta</h1>
    
    <div class="mt-4 flex space-x-4">
      <input v-model="searchText" type="text" placeholder="Szukaj zajęć..." class="border rounded px-3 py-1">
    </div>

    <div class="mt-6">
      <table class="w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">Przedmiot</th>
            <th class="border p-2">Data</th>
            <th class="border p-2">Status</th>
            <th class="border p-2">Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in filteredSessions" :key="session.sessionId" class="hover:bg-gray-50">
            <td class="border p-2">{{ session.courseName }}</td>
            <td class="border p-2">{{ session.startTime }}</td>
            <td class="border p-2">{{ session.attendanceStatus }}</td>
            <td class="border p-2">
              <button @click="goToDetails(session.sessionId)" class="bg-blue-500 text-white px-3 py-1 rounded">
                Szczegóły
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
