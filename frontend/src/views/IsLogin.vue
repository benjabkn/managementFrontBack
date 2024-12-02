<template>
    <div v-if="isAuthenticated">
      <h1>Bienvenido al Dashboard</h1>
      <!-- Aquí iría el contenido del dashboard -->
    </div>
    <div v-else>
      <p>No tienes permiso para acceder a esta página. Redirigiendo...</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAuthenticated: false, // Estado de autenticación
      };
    },
    created() {
      this.checkAuthentication();
    },
    methods: {
      checkAuthentication() {
        // Verificar si el token JWT existe en localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          this.isAuthenticated = true; // El usuario está autenticado
        } else {
          this.isAuthenticated = false; // El usuario no está autenticado
          this.$router.push('/login'); // Redirigir al login si no está autenticado
        }
      },
    },
  };
  </script>
  