import { createRouter, createWebHistory } from 'vue-router';
import Users from '@/views/Users.vue';
import Products from '@/views/Products.vue';
import ProductosCrud from '@/views/ProductosCrud.vue';
import Login from '@/views/Login.vue';
import ErrorPage from '@/views/ErrorPage.vue'; // Importa la página de error
import Calendar from '@/views/Calendar.vue';

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        next({ name: 'Products' }); // Si el usuario está autenticado, redirige al catálogo
      } else {
        next();  // Si no está autenticado, permite que acceda al login
      }
    },
  },
  {
    path: "/productManagement",
    name: "ProductManagement",
    component: ProductosCrud,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        next({ name: 'ErrorPage' }); // Si no hay token, redirige a la página de error
      } else {
        next(); // Si el token existe, permite el acceso
      }
    },
  },
  {
    path: "/",
    name: "Products",
    component: Products,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        next({ name: 'ErrorPage' }); // Si no está autenticado, redirige a la página de error
      } else {
        next(); // Si está autenticado, permite el acceso
      }
    },
  },
  {
    path: '/error',
    name: 'ErrorPage', // Ruta para la página de error
    component: ErrorPage,
  },
  {
    path: '/Calendario',
    name: 'Calendario', // Ruta para la página de calendario
    component: Calendar,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guard global para redirigir a login si ya está autenticado
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  if (to.name === 'Login' && token) {
    next({ name: 'Products' }); // Si está logueado, redirige al catálogo
  } else {
    next(); // De lo contrario, permite la navegación
  }
});

export default router;
