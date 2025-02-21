import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/authStore'
import Login from "@/views/Login.vue";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
import TeacherSessionDetails from "@/views/TeacherSessionDetails.vue";
import StudentDashboard from "@/views/StudentDashboard.vue";
import StudentSessionDetails from "@/views/StudentSessionDetails.vue";
import Scanner from "@/views/AttendanceTeacherScanner.vue";
import StudentRegisterDevice from "@/views/StudentRegisterDevice.vue"
import AttendanceStudentQr from "@/views/AttendanceStudentQr.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/teacher",
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'teacher' } 
  },
  {
    path: "/teacher/session/:sessionId",
    component: TeacherSessionDetails,
    meta: { requiresAuth: true, role: 'teacher' } 
  },
  {
    path: "/student",
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' } 
  },
  {
    path: "/student/session/:sessionId",
    component: StudentSessionDetails,
    meta: { requiresAuth: true, role: 'student' } 
  },
  {
    path: "/scanner/:tokenScanner",
    component: Scanner,
  },
  {
    path: "/register/device/:tokenRegister",
    component: StudentRegisterDevice,
  },
  {
    path: "/student/qr/",
    component: AttendanceStudentQr,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth() // Sprawdzenie, czy użytkownik jest zalogowany

  if (to.path === '/') {
    if (authStore.isAuthenticated) {
      if (authStore.role === 'student') {
        next('/student')
      } else if (authStore.role === 'teacher') {
        next('/teacher')
      } else {
        next()
      }
    } else {
      next()
    }
  } else if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/');
    } else if (to.meta.role && to.meta.role !== authStore.role) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
