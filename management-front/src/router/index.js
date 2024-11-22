import { createRouter, createWebHistory } from 'vue-router';
import Users from '@/views/Users.vue'; // Importa tu componente Users.vue
import Products from '@/views/Products.vue';
import ProductosCrud from '@/views/ProductosCrud.vue';
import Login from '@/views/Login.vue';

const routes = [
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/productManagement",
    name: "ProductManagement",
    component: ProductosCrud,
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: '/users', // URL que llevará al componente
    name: 'Users',
    component: Users, // Asigna el componente
  },
  // Otras rutas, por ejemplo:
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'), // Carga diferida
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;