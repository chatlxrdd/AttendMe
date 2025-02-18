import { createRouter, createWebHistory } from "vue-router";
import TeacherScanner from "@/views/TeacherScanner.vue";
import StudentDeviceRegister from "@/views/StudentDeviceRegister.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/TeacherScanner",
    name: "TeacherScanner",
    component: TeacherScanner,
  },
  {
    path: "/StudentDeviceRegister",
    name: "StudentDeviceRegister",
    component: StudentDeviceRegister,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
