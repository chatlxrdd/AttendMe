<script lang="ts">
import router from '@/router';
import apiClient, { AuthResponse } from '@/api/backend';
import { decodeJwt } from '@/utils/DecodeJwt.vue';

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
</script>