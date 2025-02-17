import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import apiClient from './plugins/api';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.config.globalProperties.$api = apiClient; // Dodanie API globalnie
app.mount('#app');
