import { createRouter, createWebHistory } from 'vue-router';
import TeacherScanner from '../components/TeacherScanner.vue';
import StudentDeviceRegister from '../components/StudentDeviceRegister.vue';
import Home from '../components/Home.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/teacher-scanner', component: TeacherScanner },
    { path: '/student-register', component: StudentDeviceRegister }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;