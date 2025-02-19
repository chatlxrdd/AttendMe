<script lang="ts">
import router from '@/router';
import apiClient from '@/api/backend';
import { decodeJwt } from '@/utils/DecodeJwt.vue';

interface AuthResponse {
  token: string;
};

export const tokenValid = async() => {
  try {
    const token = localStorage.getItem("token");
    if (token == null) { 
      console.log("Brak tokena, zaloguj się.")
      router.push("/");
    } else {
      const userId = decodeJwt(localStorage.getItem("token")!).sub;
      console.log(`Sprawdzanie tokena dla użytkownika o id: ${userId}`);
      const response = await apiClient.get<AuthResponse>(
        `/user/get?userId=${userId}`,
        null,
      );
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("❌ Token wygasł lub jest niepoprawny. Zaloguj się ponownie");
      localStorage.removeItem("token");
      router.push("/");
    }
  } 
};
</script>