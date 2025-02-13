import { createRouter, createWebHistory } from "vue-router";
import StudentDashboard from "@/views/StudentDashboard.vue";
import CourseDetails from "@/views/CourseDetails.vue";
import Login from "@/views/Login.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/student/dashboard", component: StudentDashboard },
  { path: "/student/course/:id", component: CourseDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
