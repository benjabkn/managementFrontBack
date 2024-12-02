<template>
  <div class="container">
    <!-- Barra de navegación -->
    <header>

    </header>

    <!-- Modal para crear un nuevo usuario -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeCreateModal">&times;</span>
        <form @submit.prevent="createUser">
          <h2>Crear Usuario</h2>
          <div class="form-group">
            <label for="createUsername">Nombre:</label>
            <input type="text" id="createUsername" v-model="newUser.name" required /><br />
          </div>
          <div class="form-group"> <label for="createEmail">Correo Electrónico:</label>
            <input type="text" id="createEmail" v-model="newUser.email" required /><br />
          </div>
          <div class="form-group">
            <label for="createPassword">Contraseña:</label>
            <input type="password" id="createPassword" v-model="newUser.password" required /><br />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Crear Usuario</button>
            <button type="button" class="btn btn-secondary" @click="closeCreateModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
    <div class="container-up-table">
      <div>
        <h1>Lista de Usuarios</h1>
      </div>
      <div class="flex-container">
        <button @click="openCreateModal" class="btn btn-create">Crear Usuario</button>
          <span class="mdi mdi-create mdi-24px"></span>
          <span class="mdi mdi-create mdi-24px"></span>
        <!-- Tabla de usuarios -->

      </div>

    </div>
    <table class="product-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <div class="table-action">
              <button @click="openEditModal(user)" class="btn btn-edit">Editar</button>
              <button @click="deleteUser(user._id)" class="btn btn-delete">
                <span class="mdi mdi-delete mdi-24px"></span>
                <span class="mdi mdi-delete-empty mdi-24px"></span>
                <span>Eliminar</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para editar usuario -->
    <!-- Modal para editar usuario -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <form @submit.prevent="updateUser">
          <h2>Editar Usuario</h2>

          <div class="form-group">
            <label for="editUsername">Nombre:</label>
            <input type="text" id="editUsername" v-model="editUser.name" required />
          </div>

          <div class="form-group">
            <label for="editEmail">Correo electrónico:</label>
            <input type="email" id="editEmail" v-model="editUser.email" required />
          </div>

          <div class="form-group">
            <label for="editPassword">Contraseña:</label>
            <input type="password" id="editPassword" v-model="editUser.password" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Actualizar Usuario</button>
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserView",
  data() {
    return {
      showEditModal: false, // Control del modal de edición
      showCreateModal: false, // Asegúrate de incluir esto
      apiUrl: "http://localhost:3003/api/users", // URL base de la API
      users: [], // Lista de usuarios
      newUser: { name: "", email: "", password: "" }, // Datos para nuevo usuario
      editUser: { _id: "", name: "", email: "", password: "" }, // Datos para edición
    };
  },
  methods: {
    async loadUsers() {
      try {
        const response = await axios.get(this.apiUrl);
        this.users = response.data;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },
    openCreateModal() {
      this.showCreateModal = true; // Mostrar modal de creación
    },
    closeCreateModal() {
      this.showCreateModal = false; // Ocultar modal de creación
      this.newUser = { name: "", email: "", password: "" }; // Limpiar formulario
    },
    openEditModal(user) {
      this.editUser = { ...user }; // Copia los datos del usuario a editar
      this.showEditModal = true; // Muestra el modal de edición
    },
    closeEditModal() {
      this.showEditModal = false; // Oculta el modal
      this.editUser = { _id: "", name: "", email: "", password: "" }; // Limpia los datos del formulario
    },
    async createUser() {
      try {
        const response = await axios.post(this.apiUrl, this.newUser);
        alert("Usuario creado con éxito");
        console.log(response)
        this.newUser = { name: "", email: "", password: "" }; // Limpiar el formulario
        await this.loadUsers(); // Recargar la lista de usuarios
        this.closeCreateModal();

      } catch (error) {
        console.error("Error al crear usuario:", error);
        alert("Error al crear usuario.");
      }
    },
    async updateUser() {
      try {
        const response = await axios.put(`${this.apiUrl}/${this.editUser._id}`, this.editUser);
        this.users = this.users.map((user) =>
          user._id === this.editUser._id ? response.data : user
        ); // Actualizar lista de usuarios
        this.closeEditModal();
        alert("Usuario actualizado con éxito");
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        alert("Error al actualizar usuario.");
      }
    },
    async deleteUser(userId) {
      if (confirm("¿Estás seguro de eliminar este usuario?")) {
        try {
          await axios.delete(`${this.apiUrl}/${userId}`);
          this.users = this.users.filter((user) => user._id !== userId); // Eliminar usuario de la lista
          alert("Usuario eliminado con éxito");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          alert("Error al eliminar usuario.");
        }
      }
    },
  },
  mounted() {
    this.loadUsers(); // Cargar usuarios al montar el componente
  },
};
</script>





<style scoped>
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container-up-table {
  display: flex;
}

.flex-container {
  color: #ffffff;
  /* Texto blanco */
  display: flex;
  margin-left: auto;
  /* Empuja el botón hacia la derecha */

}

.name {
  display: flex;
  justify-content: flex-start;
}

/* Body styles */
body {
  /* Suave azul claro */
  color: #333;
  /* Texto oscuro para legibilidad */
  line-height: 1.6;
}

/* Main container */
.container {
  max-width: 800px;
  margin: 20px auto;
  background-color: #ffffff;
  /* Fondo blanco para el contenido */
  border-radius: 8px;
  /* Esquinas redondeadas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Sombra sutil */
  padding: 20px;
  /* Espaciado interno */
}


/* Header styles */
.top-bar {
  /* Azul verdoso oscuro */
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  /* Separación con el contenido */
}

.top-bar button {
  background-color: transparent;
  color: #ffffff;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.top-bar button:hover {
  color: #83c5be;
  /* Azul verdoso más claro */
}

/* Table styles */
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
}

.product-table th,
.product-table td {
  border: 1px solid #d4e4e7;
  /* Azul claro */
  padding: 12px;
  text-align: center;
}

.product-table th {
  background-color: #edf7f9;
  /* Fondo azul muy claro */
  font-weight: bold;
}

.product-table tr:nth-child(even) {
  background-color: #f4fbfc;
  /* Azul claro para filas pares */
}


/* Button styles */
.btn-primary {
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: right;
  margin-left: auto;
  font-size: 16px;
  /* Tamaño de la fuente */

  /* Empuja el botón hacia la derecha */

}


.btn-primary:hover {
  background-color: #83c5be;
}

.btn-secondary {
  background-color: #d4e4e7;
  /* Botón de cancelar */
  color: #333;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #83c5be;

  /* Más oscuro al pasar el cursor */
}

/* Modal styles */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro semitransparente */
  z-index: 1000;
}

@import "~@mdi/font/css/materialdesignicons.min.css";
/* Variables de color */

body {
  margin: 32px;
}

.btn {
  display: flex;
  align-items: center;
  background: none;
  border: 1px solid #bdbdbd;
  height: 48px;
  padding: 10px 20px;
  /* Espaciado interno */
  letter-spacing: .25px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  /* Tamaño de la fuente */
  transition: background-color 0.3s, transform 0.2s ease;
  /* Transición suave */



  &:focus {
    outline: none;
  }

  .mdi {
    margin-right: 8px;
  }
}

.btn-delete {
  font-size: 16px;
  color: red;

  .mdi-delete-empty {
    display: none;
  }

  &:hover {
    background-color: lighten(red, 48%);

    >.mdi-delete-empty {
      display: block;
    }

    >.mdi-delete {
      display: none;
    }
  }
}


.btn-edit {
  font-size: 16px;
  color: black;

  >.mdi-edit-empty {
    display: none;
  }

  &:hover {
    background-color: lighten(yellow, 48%);

    >.mdi-edit-empty {
      display: block;
    }

    >.mdi-edit {
      display: none;
    }
  }
}
.btn-create {
  font-size: 16px;
  color: black;

  >.mdi-create-empty {
    display: none;
  }

  &:hover {
    background-color: lighten(yellow, 48%);

    >.mdi-create-empty {
      display: block;
    }

    >.mdi-create {
      display: none;
    }
  }
}
.table-action {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding: 10px 25px;
}



.modal-content {
  background-color: #ffffff;
  padding: 20px 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}

/* Close button */
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #006d77;
  /* Azul verdoso oscuro */
}

/* Estilo para el fondo del modal */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro semitransparente */
  z-index: 1000;
}

/* Estilo para el contenido del modal */
.modal-content {
  background-color: #ffffff;
  padding: 20px 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}

/* Botón de cierre del modal */
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

/* Título del formulario */
.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* Estilo de los elementos del formulario */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  color: #333;
}

.form-actions {
  display: flex;
  /* Activa flexbox */
  justify-content: flex-end;
  /* Alinea los botones a la derecha */
  gap: 10px;
  /* Espaciado entre los botones */
  margin-top: 20px;
  /* Espaciado superior */
}
</style>