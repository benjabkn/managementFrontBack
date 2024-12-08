<template>
  <div id="app">
    <nav>
      <router-link v-if="isAuthenticated" to="/users">Usuarios</router-link>

      <router-link to="/Reservas">Reservas</router-link> 


      <router-link to="/">Catálogo</router-link>
      <router-link v-if="isAuthenticated" to="/productManagement">Editar producto</router-link>
      
      <!-- Mostrar el enlace Login solo si no está autenticado -->
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link>

      <!-- Mostrar el enlace Logout solo si está autenticado -->
      <router-link v-if="isAuthenticated" @click="logout" to="#">Logout</router-link>
    </nav>

    <!-- Si isLoading es true, muestra el spinner, si no, muestra el contenido -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div> <!-- Aquí va tu spinner de carga -->
    </div>
    
    <!-- El contenido solo se renderiza cuando no está cargando -->
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false, // Estado de autenticación
      isLoading: false, // Estado de carga
    };
  },
  created() {
    this.checkAuthentication(); // Verifica el estado de autenticación cuando se cargue el componente
  },
  methods: {
    checkAuthentication() {
      // Verificar si el token JWT existe en localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        this.isAuthenticated = true; // El usuario está autenticado
      } else {
        this.isAuthenticated = false; // El usuario no está autenticado
      }
    },
    logout() {
      // Eliminar el token JWT de localStorage
      localStorage.removeItem('authToken');
      // Redirigir al login
      this.$router.push('/login');
      alert('Sesión cerrada correctamente')
      this.isAuthenticated = false; // Actualizar el estado de autenticación
    },
    setLoadingState(isLoading) {
      this.isLoading = isLoading; // Método para controlar el estado de carga
    },
  },
};
</script>

<style scoped>
/* Estilos del spinner */
#app{
  text-decoration: none;
}

/* Navigation styles */
nav {
  background-color: #444;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
}

/* Link styles */
nav a {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
}

nav a:hover {
  color: #ddd;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo oscuro semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  border: 4px solid #f3f3f3; /* Fondo claro */
  border-top: 4px solid #3498db; /* El color del spinner */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
