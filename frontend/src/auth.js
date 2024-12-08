// src/auth.js
import VueAuth from '@websanova/vue-auth';
import axios from 'axios';

export default {
  install(app) {
    app.use(VueAuth, {
      axios,
      auth: {
        // El nombre del token en el almacenamiento local (localStorage).
        token: 'auth_token',
        // Nombre del almacenamiento de sesión (localStorage o sessionStorage).
        storage: localStorage,
      },
      fetchData: {
        url: 'http://localhost:3003/api/users/me', // Endpoint para obtener los datos del usuario
        method: 'GET',
        enabled: true,
      },
      loginData: {
        url: 'http://localhost:3003/api/users/login', // Endpoint para login
        method: 'POST',
        redirect: '/',
      },
      logoutData: {
        url: 'http://localhost:3003/api/users/logout', // Endpoint para logout
        method: 'POST',
        redirect: '/login',
      },
    });
  },
};
