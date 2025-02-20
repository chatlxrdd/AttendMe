import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
import SessionDetails from "@/views/SessionDetails.vue";
import Scanner from "@/views/Scanner.vue";

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
  {
    path: "/session/:sessionId",
    name: "SessionDetails",
    component: SessionDetails,
  },
  {
    path: "/scanner/:tokenScanner",
    name: "Scanner",
    component: Scanner,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
