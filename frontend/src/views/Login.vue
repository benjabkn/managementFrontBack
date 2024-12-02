<template>
  <div class="wrapper">
    <form class="login" @submit.prevent="handleLogin">
      <p class="title">Log in</p>
      <input type="text" placeholder="Email" v-model="email" autofocus required />
      <i class="fa fa-user"></i>
      <input type="password" placeholder="Contraseña" v-model="password" required />
      <i class="fa fa-key"></i>
      <button :disabled="isWorking">
        <i v-if="isWorking" class="spinner"></i>
        <span class="state">{{ isWorking ? "Autenticando..." : "Iniciar Sesión" }}</span>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      isWorking: false, // Controla el estado de carga
    };
  },
  methods: {
    async handleLogin() {
      if (this.isWorking) return; // Evita múltiples envíos

      this.isWorking = true;

      try {
        const response = await fetch("http://localhost:3003/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Inicio de sesión exitoso");
          console.log("Datos del usuario:", data.user);

          // Guardar el token en localStorage
          localStorage.setItem('authToken', data.token);

          this.isWorking = false;
          window.location.reload();

          this.$router.push("/isLogin");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          this.isWorking = false;
        }
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        alert("Ocurrió un error al iniciar sesión.");
        this.isWorking = false;
      }
    },
  },


};
</script>
<style scoped>
body {
  height: 100vh;
  background-size: cover;
}

@keyframes spinner {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(359deg);
  }
}

* {
  box-sizing: border-box;
}

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background: rgba(darken(#2196F3, 40%), 0.85);
}

.login {
  border-radius: 2px 2px 5px 5px;
  padding: 10px 20px 20px 20px;
  width: 90%;
  max-width: 320px;
  background: #ffffff;
  position: relative;
  padding-bottom: 80px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
}

.login button {
  width: 100%;
  height: 100%;
  padding: 10px 10px;
  background: #2196F3;
  color: #fff;
  display: block;
  border: none;
  margin-top: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  max-height: 60px;
  border-radius: 0 0 2px 2px;
  transform: rotateZ(0deg);

  transition: all 0.1s ease-out;
  border-bottom-width: 7px;
}

.login button:disabled {
  background-color: #b0bec5; /* Desactivar el color del botón mientras está cargando */
  cursor: not-allowed; /* Cambiar el cursor cuando el botón está deshabilitado */
}

.login .spinner {
  display: block;
  width: 40px;
  height: 40px;
  position: absolute;
  border: 4px solid #ffffff;
  border-top-color: rgba(255, 255, 255, 0.3);
  border-radius: 100%;
  left: 50%;
  top: 50%;
  opacity: 1;
  margin-left: -20px;
  margin-top: -20px;
  animation: spinner 0.6s infinite linear;
  transition: opacity 0.3s ease;
}

.login .state {
  visibility: visible; /* Ocultar el texto de estado mientras se muestra el spinner */
}

.login button:disabled .state {
  visibility: visible;
}

.login input {
  display: block;
  padding: 15px 10px;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid #ddd;
  transition: border-width 0.2s ease;
  border-radius: 2px;
}

.title {
  color: #444;
  margin: 10px 0 30px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

footer {
  display: block;
  padding-top: 50px;
  text-align: center;
  color: #ddd;
  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.2);
  font-size: 0.8em;
}

footer a,
footer a:link {
  color: #fff;
}
</style>