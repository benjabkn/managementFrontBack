<template>
    <div class="error-page">
      <h1>Error 403</h1>
      <p>No tienes permiso para acceder a esta página. Por favor, inicia sesión.</p>
      <router-link to="/login">Ir al login</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorPage'
  };
  </script>
  
  <style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40vh; /* Altura completa de la ventana */
    color: #721c24; /* Color del texto para errores */
    text-align: center; /* Centrar texto */
}

.error-page h1 {
    font-size: 3rem; /* Tamaño de fuente grande para el encabezado */
    margin-bottom: 1rem; /* Espaciado inferior */
}

.error-page p {
    font-size: 1.25rem; /* Tamaño de fuente más pequeño para el texto */
    margin-bottom: 2rem; /* Espaciado inferior */
}

.error-page a {
    padding: 0.5rem 1rem; /* Espaciado interno del enlace */
    background-color: #007bff; /* Color de fondo del botón */
    color: white; /* Color del texto del botón */
    text-decoration: none; /* Sin subrayado */
    border-radius: 0.25rem; /* Bordes redondeados */
}

.error-page a:hover {
    background-color: #0056b3; /* Color de fondo al pasar el ratón */
}
  </style>
  