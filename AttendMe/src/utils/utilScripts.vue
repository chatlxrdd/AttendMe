<script lang="ts">
import router from '@/router';
import apiClient, { AuthResponse } from '@/api/backend';

export const decodeJwt = (token: string): any => {
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
};

export const tokenValid = async() => {
  try {
    const token = localStorage.getItem("token");
    if (token == null) { 
      console.log("Brak tokena, zaloguj się.");
      router.push("/");
      return false;
    } else {
      const userId = decodeJwt(localStorage.getItem("token")!).sub;
      const response = await apiClient.get<AuthResponse>(
        `/user/get?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data ? true : false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Token wygasł lub jest niepoprawny. Zaloguj się ponownie");
      localStorage.removeItem("token");
      router.push("/");
      return false;
    }
  } 
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Brak daty";
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, '.');
}

export const formatTime = (dateString: string | null) => {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

</script>