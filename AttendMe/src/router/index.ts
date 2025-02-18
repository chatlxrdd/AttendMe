import { createRouter, createWebHistory } from "vue-router";
import StudentDashboard from "@/views/StudentDashboard.vue";
import CourseDetails from "@/views/CourseDetails.vue";
import Login from "@/views/Login.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/student/dashboard", name: 'Dashboard', component: StudentDashboard },
  { path: "/student/course/:id", name: 'Course', component: CourseDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
