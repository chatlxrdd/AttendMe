import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
import SessionDetails from "@/views/SessionDetails.vue";

const routes = [
  {
    path: "/login",
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
