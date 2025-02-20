import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
// import TeacherSessionDetails from "@/views/TeacherSessionDetails.vue";
import Scanner from "@/views/Scanner.vue";
import RegisterDevice from "@/views/StudentRegisterDevice.vue"

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/teacher",
    name: "TeacherDashboard",
    component: TeacherDashboard,
  },
  // {
  //   path: "/teacher/session/:sessionId",
  //   name: "TeacherSessionDetails",
  //   component: TeacherSessionDetails,
  // },
  {
    path: "/scanner/:tokenScanner",
    name: "Scanner",
    component: Scanner,
  },
  {
    path: "/register/device",
    name: "Zarejestruj urządzenie",
    component: RegisterDevice,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
