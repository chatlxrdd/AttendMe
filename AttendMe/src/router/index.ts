import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Student from "@/views/Student.vue";
import Teacher from "@/views/Teacher.vue";


const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: '/student',
    name: 'Student',
    component: Student
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: Teacher
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;