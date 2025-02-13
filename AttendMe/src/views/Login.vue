<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/api/backend";

interface TokenResult {
  token: string;
}

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
  try {
    const response = await apiClient.post<TokenResult>("/user/login", {
      loginName: username.value,
      password: password.value,
    });

    localStorage.setItem("token", response.data.token);
    router.push("/student/dashboard");
  } catch (error) {
    errorMessage.value = "Błąd logowania!";
  }
};
</script>
