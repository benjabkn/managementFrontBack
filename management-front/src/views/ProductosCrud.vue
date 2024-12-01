<template>

  <div class="container">
    <!-- Barra de búsqueda -->
    <header class="top-bar">
    </header>

    <!-- Botón para agregar productos -->
    <div class="flex-container">
      <h1 class="bold">Lista de productos</h1>
      <button @click="openCreateModal" class="btn btn-create">Crear producto</button>
      <button @click="openCreateCategoryModal" class="btn btn-create">Crear categoria</button>
      <button @click="openDeleteCategoryModal" class="btn btn-create">Borrar categoria</button>

      <!-- Tabla de usuarios -->
      <div>
        <div class="product-table">
          <div class="search-component">
            <input class="top-bar-search" placeholder="Buscar producto por nombre" v-model="searchQuery"
              @input="filterProducts" />
          </div>
        </div>
      </div>

    </div>
    <!-- Modal para confirmar eliminación de categoría -->
    <div v-if="showDeleteCategoryModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteCategoryModal">&times;</span>
        <h2>Selecciona una categoría para eliminar:</h2>

        <!-- Dropdown para seleccionar la categoría a eliminar -->
        <div class="form-group">
          <select v-model="categoryToDelete" required>
            <option disabled value="">Selecciona una categoría</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Botones para cancelar o confirmar eliminación -->
        <div class="form-actions">
          <button @click="confirmDeleteCategory" class="btn btn-danger" :disabled="!categoryToDelete">
            Confirmar Eliminación
          </button>
          <button @click="closeDeleteCategoryModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="container-up-table">
      <table class="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product._id">
            <td>{{ product.name }}</td>
            <td>
              <div>
                <!-- Mostrar la imagen si existe, o mostrar el texto "Sin imagen" si no -->
                <img v-if="product.image" :src="product.image" :alt="product.name" />
                <span v-else>Sin imagen</span>
              </div>
            </td>
            <td>
              <div>
                <!-- Iterar sobre las categorías para encontrar el nombre correspondiente -->
                <span v-if=product.category>
                  {{ product.category.name }}
                </span>
                <span v-else>Sin categoría</span>
              </div>
            </td>
            <td>{{ product.price ? `$${product.price}` : "-" }}</td>
            <td>
              <div class="button-container">
                <button class="button-3d" @click="updateStock(product._id, 1)">
                  <span class="material-icons">+</span>
                  <div class="button-bottom"></div>
                  <div class="button-base"></div>
                </button>
                <span>{{ product.stock > 0 ? product.stock : "Sin stock" }}</span>
                <button class="button-3d" @click="updateStock(product._id, -1)">
                  <span class="material-icons">-</span>
                  <div class="button-bottom"></div>
                  <div class="button-base"></div>
                </button>
              </div>
            </td>
            <td>
              <div class="table-action">
                <button @click="openEditModal(product)" class="btn btn-edit">
                  <span>Editar</span>
                </button>
                <button @click="deleteProduct(product._id)" class="btn btn-delete">
                  <span class="mdi mdi-delete mdi-24px"></span>
                  <span class="mdi mdi-delete-empty mdi-24px"></span>
                  <span>Eliminar</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear categoria -->
    <div>
      <div v-if="showCreateCategoryModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeCreateCategoryModal">&times;</span>
          <form @submit.prevent="handleCreateCategory">
            <h2>Crear Categoría</h2>
            <div class="form-group">
              <label for="categoryName">Nombre de la Categoría:</label>
              <input type="text" id="categoryName" v-model="newCategory.name" required />
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                {{ isSubmitting ? "Creando..." : "Crear Categoría" }}
              </button>
              <button type="button" class="btn btn-secondary" @click="closeCreateCategoryModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>


    <!-- Modal para crear producto -->
    <div>
      <!-- Modal para crear producto -->
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeCreateModal">&times;</span>
          <form @submit.prevent="handleCreateProduct" id="productForm">
            <h2>Agregar Producto</h2>
            <div class="form-group">
              <label for="name">Nombre del Producto:</label>
              <input type="text" id="name" v-model="newProduct.name" required />
            </div>
            <div class="form-group">
              <label for="price">Precio:</label>
              <input type="number" id="price" v-model="newProduct.price" required />
            </div>
            <div class="form-group">
              <div>
                <div role="button">
                  <a class="button">Categoría:</a>
                </div>
                <div class="dropbox">
                  <select v-model="newProduct.category" required>
                    <option class="bar" v-for="category in categories" :key="category._id" :value="category._id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

            </div>
            <div class="form-group">
              <label for="stock">Stock:</label>
              <input type="number" id="stock" v-model="newProduct.stock" required />
            </div>
            <div class="form-group">
              <label for="image">Imagen:</label>
              <input type="file" id="image" @change="handleImageUpload" />
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                {{ isSubmitting ? "Creando..." : "Crear Producto" }}
              </button>
              <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para editar producto -->
    <div>
      <!-- Modal para editar producto -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeEditModal">&times;</span>
          <form @submit.prevent="handleEditProduct" id="editProductForm">
            <h2>Editar Producto</h2>
            <div class="form-group">
              <label for="editName">Nombre del Producto:</label>
              <input type="text" id="editName" v-model="editProduct.name" required />
            </div>
            <div class="form-group">
              <label for="editPrice">Precio:</label>
              <input type="number" id="editPrice" v-model="editProduct.price" required />
            </div>
            <div class="form-group">
              <label for="editCategory">Categoría:</label>
              <select v-model="editProduct.category" required>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="editStock">Stock:</label>
              <input type="number" id="editStock" v-model="editProduct.stock" required />
            </div>
            <div class="form-group">
              <label for="editImage">Imagen:</label>
              <input type="file" id="editImage" @change="handleEditImageUpload" />
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                {{ isSubmitting ? "Actualizando..." : "Actualizar Producto" }}
              </button>
              <button type="button" class="btn btn-secondary" @click="closeEditModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      apiUrl: "http://localhost:3003/api/menu", // URL de la API
      apiUrlCategory: "http://localhost:3003/api/categories", // URL de la API
      products: [], // Lista de productos cargados
      filteredProducts: [], // Lista filtrada para búsqueda
      searchQuery: "", // Texto de búsqueda
      showCreateModal: false, // Control para mostrar/ocultar el modal de creación
      showEditModal: false, // Control para mostrar/ocultar el modal de edición
      showCreateCategoryModal: false, // Control para mostrar/ocultar el modal de categorías
      showDeleteCategoryModal: false, // Controla la visibilidad del modal de eliminación
      categoryToDelete: null, // Guarda la categoría seleccionada para eliminar
      newCategory: {
        name: ""
      },
      newProduct: {
        name: "",
        price: 0,
        category: "",
        stock: 0,
        image: null,
      },
      isSubmitting: false, // Estado para deshabilitar el botón mientras se envía,
      editProduct: { // Datos para editar un producto existente
        _id: null,
        name: "",
        price: 0,
        category: "",
        stock: 0,
        image: null,
      },
    };
  },
  methods: {
    async loadProducts() {
      try {
        const response = await axios.get(this.apiUrl);
        this.products = response.data;
        this.filteredProducts = response.data;
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    },
    async loadCategories() {

      try {
        const response = await axios.get(this.apiUrlCategory);
        if (response.status === 200) {
          this.categories = response.data; // Asumimos que el backend devuelve un arreglo de categorías
        } else {
          alert("Error al cargar las categorías.");
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        alert("Ocurrió un error al cargar las categorías.");
      }
    },
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter((product) => {
        const category = product.category ? String(product.category).toLowerCase() : '';
        return (
          product.name.toLowerCase().includes(query) ||
          category.includes(query)
        );
      });
    },
    openCreateModal() {
      this.showCreateModal = true;
      this.newProduct = { name: "", price: 0, category: "", stock: 0, image: null };
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    openEditModal(product) {
      this.editProduct = { ...product }; // Copia los datos del producto seleccionado
      if (this.editProduct.category) {
        // Si la categoría está presente, buscamos el objeto de la categoría completo
        const category = this.categories.find(cat => cat._id === this.editProduct.category._id || cat._id === this.editProduct.category);
        this.editProduct.category = category ? category._id : ""; // Asignamos el ID de la categoría completa al campo
      }

      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editProduct = { id: null, name: "", price: 0, category: "", stock: 0, image: null };
    },
    openCreateCategoryModal() {
      this.showCreateCategoryModal = true;
      this.newCategory = { name: "" }; // Reinicia el formulario
    },
    closeCreateCategoryModal() {
      this.showCreateCategoryModal = false;
    },
    openDeleteCategoryModal(category) {
      this.categoryToDelete = category; // Asigna la categoría que se va a eliminar
      this.showDeleteCategoryModal = true; // Muestra el modal
    },

    // Cierra el modal de confirmación
    closeDeleteCategoryModal() {
      this.showDeleteCategoryModal = false;
      this.categoryToDelete = null; // Limpiar la categoría a eliminar
    },
    handleNewImageUpload(event) {
      this.newProduct.image = event.target.files[0];
    },
    handleEditImageUpload(event) {
      this.editProduct.image = event.target.files[0];
    },
    handleImageUpload(event) {
      this.newProduct.image = event.target.files[0];
    },
    async confirmDeleteCategory() {
    if (!this.categoryToDelete) {
      alert("Por favor, selecciona una categoría para eliminar.");
      return;
    }

    try {
      // Usar la URI proporcionada para eliminar la categoría seleccionada
      const response = await axios.delete(`http://localhost:3003/api/categories/${this.categoryToDelete}`);
      
      if (response.status === 200 || response.status === 204) {
        alert("Categoría eliminada con éxito.");
        this.loadCategories(); // Recargar la lista de categorías después de la eliminación
        this.closeDeleteCategoryModal(); // Cerrar el modal
        this.loadProducts(); //
        this.loadCategories();
      } else {
        alert("Error al eliminar la categoría.");
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert("Ocurrió un error al eliminar la categoría.");
    }
  },
    async getProductWithCategory(productId) {
      try {
        // Primero obtenemos el producto por su ID
        const productResponse = await axios.get(`${this.apiUrl}/${productId}`);
        const product = productResponse.data;

        // Ahora obtenemos la categoría usando el ID de la categoría que está en el producto
        if (product.category) {
          const categoryResponse = await axios.get(`${this.apiUrlCategory}/${product.category}`);
          const category = categoryResponse.data;

          // Asignamos el nombre de la categoría al producto
          product.categoryName = category.name;  // Aquí estamos añadiendo el nombre de la categoría al producto

          return product;  // Devolvemos el producto con el nombre de la categoría
        } else {
          console.error("El producto no tiene categoría asociada.");
          return product;
        }
      } catch (error) {
        console.error("Error al obtener el producto y la categoría:", error);
        throw error;  // Lanzamos el error para manejarlo en el componente
      }
    },
    async handleCreateProduct() {
      this.isSubmitting = true; // Deshabilitar el botón
      try {
        const formData = new FormData();
        formData.append("name", this.newProduct.name.trim());
        formData.append("price", parseFloat(this.newProduct.price));
        formData.append("category", this.newProduct.category);
        formData.append("stock", parseInt(this.newProduct.stock));
        formData.append("image", this.newProduct.image);

        const response = await axios.post(this.apiUrl, formData);

        if (response.status === 200 || response.status === 201) {
          alert("Producto creado con éxito.");
          this.loadProducts(); // Recargar la lista de productos
          this.closeCreateModal(); // Cerrar el modal
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error al agregar el producto:", error);
        alert("Ocurrió un error al agregar el producto.");
      } finally {
        this.isSubmitting = false; // Reactivar el botón
      }
    },
    async handleCreateCategory() {
      this.isSubmitting = true;
      try {
        // Verificar si el nombre está vacío
        if (!this.newCategory.name.trim()) {
          alert("Por favor ingresa un nombre para la categoría.");
          this.isSubmitting = false;
          return;
        }

        const categoryData = {
          name: this.newCategory.name.trim(),
        };

        // Revisar el contenido de categoryData para asegurarse de que tiene el nombre
        console.log("Enviando datos:", categoryData);

        const response = await axios.post(this.apiUrlCategory, categoryData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200 || response.status === 201) {
          alert("Categoría creada con éxito.");
          this.loadCategories(); // Recargar la lista de categorías
          this.closeCreateCategoryModal(); // Cerrar el modal
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error al agregar la categoría:", error);
        alert("Ocurrió un error al agregar la categoría.");
      } finally {
        this.isSubmitting = false;
      }
    }
    ,

    async handleEditProduct() {
      this.isSubmitting = true; // Deshabilitar el botón de envío

      try {
        const formData = new FormData();
        formData.append("name", this.editProduct.name.trim());
        formData.append("price", parseFloat(this.editProduct.price));
        formData.append("category", this.editProduct.category);
        formData.append("stock", parseInt(this.editProduct.stock));

        if (this.editProduct.image) {
          formData.append("image", this.editProduct.image);
        }
        const response = await axios.put(
          `${this.apiUrl}/${this.editProduct._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          alert("Producto actualizado con éxito.");
          this.loadProducts(); // Recargar productos después de la actualización
          this.closeEditModal(); // Cerrar el modal
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        alert("Ocurrió un error al actualizar el producto.");
      } finally {
        this.isSubmitting = false; // Reactivar el botón
      }
    },
    async deleteProduct(productId) {
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
          await axios.delete(`${this.apiUrl}/${productId}`);
          this.loadProducts();
        } catch (error) {
          console.error("Error al eliminar producto:", error);
        }
      }
    },

    async updateStock(productId, change) {
      try {
        const product = this.products.find((p) => p._id === productId);
        const newStock = Math.max(0, product.stock + change);
        await axios.put(`${this.apiUrl}/${productId}`, { stock: newStock });
        this.loadProducts();
      } catch (error) {
        console.error("Error al actualizar stock:", error);
      }
    },
  },
  mounted() {
    this.loadProducts();
    this.loadCategories(); // Cargar categorías al montar el componente

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
  gap: 40px;
  justify-content: center;
  padding-top: 6px;

}

.top-bar-search {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.name {
  display: flex;
  justify-content: flex-start;
}

/* Body styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #e6f7ff;
  /* Suave azul claro */
  color: #333;
  /* Texto oscuro para legibilidad */
  line-height: 1.6;
}

/* Main container */
.container {
  max-width: auto;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;
  /* Permite scroll horizontal en caso de contenido amplio */
}

table {
  width: 100%;
  border-collapse: collapse;
  /* Elimina bordes duplicados */
  margin: 20px 0;
  font-size: 14px;
}

th,
td {
  text-align: left;
  /* Alineación del texto */
  padding: 12px;
  /* Espaciado interno */
  border: 1px solid #ddd;
  /* Bordes ligeros entre celdas */
}

th {
  background-color: #f4f4f4;
  /* Fondo para encabezados */
  font-weight: bold;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
  /* Colores alternos en filas */
}

td img {
  max-width: 100px;
  /* Cambia el ancho máximo de las imágenes */
  height: auto;
  /* Mantén las proporciones */
  display: block;
  margin: 0 auto;
  /* Centra las imágenes */
  border-radius: 6px;
  /* Opcional: bordes redondeados */
}

td div {
  display: inline-flex;
  gap: 4px;
  /* Espaciado pequeño entre botones */
  align-items: center;
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
  margin: 0;
  /* Elimina cualquier margen adicional */


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
  justify-content: space-evenly;
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

.form-group section {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  color: #333;
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

.button-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.button-3d {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  border-width: 0;
  padding: 0 8px;
  min-width: 4em;
  min-height: 4em;
  box-sizing: border-box;
  background: transparent;
  font: inherit;
  cursor: pointer;
  margin: 10px;
  border-radius: 20px;
}

.button-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 8px 16px;
  transform: translateY(0);
  color: #fff;
  background-image: linear-gradient(145deg, #6a11cb, #2575fc);
  text-shadow: 0 -1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  transition: transform 0.3s, border-radius 0.3s, background 10s;
}

.button-3d:active .button-top {
  border-radius: 10px 10px 8px 8px / 8px;
  transform: translateY(2px);
  background-image: linear-gradient(145deg, #2575fc, #6a11cb);
}

.button-bottom {
  position: absolute;
  z-index: 1;
  bottom: 4px;
  left: 4px;
  border-radius: 20px;
  padding-top: 6px;
  width: calc(100% - 8px);
  height: calc(100% - 10px);
  transition: border-radius 0.2s, padding-top 0.2s;
}

.button-base {
  position: absolute;
  z-index: 0;
  top: 4px;
  left: 0;
  border-radius: 20px;
  width: 100%;
  height: calc(100% - 4px);
  transition: border-radius 0.2s, padding-top 0.2s;
}

.button-3d:active .button-bottom {
  border-radius: 10px 10px 8px 8px / 8px;
  padding-top: 0;
}

.button-3d:active .button-base {
  border-radius: 10px 10px 8px 8px / 8px;
}

.dropdown {
  position: relative;
  min-width: 200px;

}

.search-component {
  display: flex;
  align-items: flex-end;
}

.bold {
  font-weight: bold;
  color: black
}
</style>