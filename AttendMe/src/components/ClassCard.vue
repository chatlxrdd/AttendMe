<script setup lang="ts">
defineProps<{
  courseSessionId: number;
  courseGroupName: string;
  courseName: string;
  locationName: string;
  dateStart: string;
  dateEnd: string;
}>();

// Funkcje formatowania daty i czasu
function formatDate(dateString: string | null) {
  if (!dateString) return "Brak daty";
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, '.');
}

function formatTime(dateString: string | null) {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
</script>

<template>
  <tr @click="$router.push('/session/' + courseSessionId)">
    <td><strong>{{ courseName || "Brak danych" }}</strong></td>
    <td>{{ formatDate(dateStart) }}</td>
    <td>{{ formatTime(dateStart) }} - {{ formatTime(dateEnd) }}</td>
    <td>{{ locationName || "Brak danych" }}</td>
    <td>{{ courseGroupName || "Brak danych" }}</td>
  </tr>
</template>

<style scoped>
td {
  padding: 12px;
  text-align: center;
  white-space: nowrap;
}
</style>
