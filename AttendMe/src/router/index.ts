import { createRouter, createWebHistory } from "vue-router";
import TeacherDashboard from "@/views/TeacherDashboard.vue";

const routes = [
  {
    path: "/",
    name: "TeacherDashboard",
    component: TeacherDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
