import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// Habilitar modo debug

createApp(App).use(router).mount('#app');