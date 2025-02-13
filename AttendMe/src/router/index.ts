import { createRouter, createWebHistory } from "vue-router";
import StudentLogin from "../views/StudentLogin.vue";
import StudentDashboard from "../views/StudentDashboard.vue";

const routes = [
  { path: "/", component: StudentLogin },
  { path: "/student/dashboard", component: StudentDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
