import { defineStore } from 'pinia';
import router from '@/router';
import apiClient from '@/api/backend';
import { decodeJwt } from '@/utils/UtilScripts';

interface User {
  isAuthenticated: boolean;
  role: 'student' | 'teacher' | null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    role: null as User['role'],
  }),
  actions: {
    login(role: User['role']) {
      this.isAuthenticated = true;
      this.role = role;
      localStorage.setItem('user', JSON.stringify({ isAuthenticated: true, role }));
    },
    logout() {
      this.isAuthenticated = false;
      this.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/');
    },
    async checkAuth() {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem("token");

      if ((user && !token) || (!user && token)) {
        console.log("Brak roli/tokena, zaloguj się.");
        this.logout();
        return;
      } else if (user) {
        this.isAuthenticated = user.isAuthenticated ? true : false;
        this.role = user.role;
      }
      
      try {
        const decoded = decodeJwt(token);
        if (!decoded?.sub) {
          console.log("❌ Błąd dekodowania tokena.");
          this.logout();
          return;
        }

        const userId = decoded.sub;
        const res = await apiClient.get( `/user/get?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const actualRole = res.data.isTeacher ? "teacher" : res.data.isStudent ? "student" : null;
        if (this.role !== actualRole) {
          console.log("❌ Niezgodność roli z tokenem");
          this.logout();
          return;
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("❌ Token wygasł lub jest niepoprawny. Zaloguj się ponownie");
          this.logout();
        }
      }
    }
  }
})
