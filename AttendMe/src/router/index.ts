import { createRouter, createWebHistory } from "vue-router";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "TeacherDashboard",
    component: TeacherDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
