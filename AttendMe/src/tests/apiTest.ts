import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";

interface TokenResult {
  token: string;
}

export const testLogin = async () => {
  try {
    const response = await axios.post<TokenResult>(`${API_BASE_URL}/user/login`, {
      loginName: "pk",
      password: "123#Asd",
    });

    if (response.data && response.data.token) {
      console.log("✅ Test zakończony sukcesem! Otrzymany token:", response.data.token);
      return response.data.token;
    } else {
      console.error("❌ Test nieudany: Brak tokena w odpowiedzi.");
      return null;
    }
  } catch (error) {
    console.error("❌ Błąd testu API:", error);
    return null;
  }
};
