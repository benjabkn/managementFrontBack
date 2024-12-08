import { createApp } from 'vue';    // Importa createApp de Vue 3
import App from './App.vue';         // Importa el componente raíz
import router from './router';       // Importa las rutas definidas en el router
import './assets/style.css';         // Asegúrate de que esta ruta sea correcta para tus estilos

// Crear la instancia de la app Vue
const app = createApp(App);

// Usar el router
app.use(router);

// Montar la app en el contenedor #app
app.mount('#app');

// No necesitas configurar Vue.config.productionTip en Vue 3
