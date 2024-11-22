<template>
  <div id="app">
    <nav>
      <router-link to="/users">Usuarios</router-link>
      <router-link to="/products">Catálogo</router-link>
      <router-link to="/productManagement">Editar producto</router-link>
      <router-link to="/login">Login</router-link>

    </nav>
    <!-- Aquí se renderizará la vista correspondiente -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>


<style>


/* Body styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  /* Light background for contrast */
}
#hidden {
  display: none;
}

/* Main app container */
#app {
  max-width: 1200px;
  /* Limit the width of the app */
  margin: auto;
  /* Center the app horizontally */
}

/* Navigation styles */
nav {
  background-color: #444;
  /* Dark gray background for the nav */
  display: flex;
  /* Use flexbox for layout */
  justify-content: space-around;
  /* Space out the links evenly */
  align-items: center;
  /* Center items vertically */
  padding: 15px 0;
  /* Add padding on top and bottom */
}

/* Link styles */
nav a {
  color: #ffffff;
  /* White text color for links */
  text-decoration: none;
  /* Remove underline */
  font-size: 16px;
  /* Standard font size */
  padding: 10px;
  /* Uniform padding for links */
  transition: color 0.3s ease;
  /* Smooth transition for hover effect */
}

/* Link hover effect */
nav a:hover {
  color: #ddd;
  /* Lighter color on hover */
}

/* Active link styles */
nav a.router-link-exact-active {
  font-weight: bold;
  /* Bold text for active link */
}

/* Responsive styles */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    /* Stack links vertically on smaller screens */
    align-items: center;
    /* Center items */
  }

  nav a {
    padding: 8px 0;
    /* Adjust padding for smaller screens */
    font-size: 14px;
    /* Slightly reduce font size */
  }
}
</style>