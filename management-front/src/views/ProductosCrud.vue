<template>
    <div class="container">
        <!-- Barra de navegación -->
        <header class="top-bar">



            <input class="top-bar-search" placeholder="Buscar producto por nombre" v-model="searchQuery"
                @input="filterProducts" />
        </header>

        <!-- Botón para agregar productos -->
        <button @click="showProductForm" class="add-product-btn">Agregar Producto</button>

        <!-- Tabla de productos -->
        <table class="product-table">
            <thead>
                <tr>
                    <th>Producto</th>
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
                        <img :src="product.image" :alt="product.name" width="50" height="50" />
                    </td>
                    <td>{{ product.category || 'Sin categoría' }}</td>
                    <td>{{ product.price ? `$${product.price}` : '-' }}</td>
                    <td>
                        <button @click="updateStock(product._id, 1)">+</button>
                        <span>{{ product.stock > 0 ? product.stock : 'Sin stock' }}</span>
                        <button @click="updateStock(product._id, -1)">-</button>
                    </td>
                    <td>
                        <button @click="editProduct(product)">Editar</button>
                        <button @click="deleteProduct(product._id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal para agregar productos -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="hideProductForm">&times;</span>
                <form @submit.prevent="saveProduct">
                    <h2>{{ isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h2>
                    <label>Nombre del Producto:</label>
                    <input v-model="currentProduct.name" required />

                    <label>Precio:</label>
                    <input type="number" v-model="currentProduct.price" required />

                    <label>Categoría:</label>
                    <input v-model="currentProduct.category" />

                    <label>Stock:</label>
                    <input type="number" v-model="currentProduct.stock" required />

                    <label>Imagen:</label>
                    <input type="file" @change="handleImageUpload" />

                    <button type="submit" class="btn-primary">
                        {{ isEditing ? 'Actualizar Producto' : 'Agregar Producto' }}
                    </button>
                    <button type="button" @click="hideProductForm" class="btn-secondary">Cancelar</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
  name: "ProductsCRUD",
  data() {
    return {
      apiUrl: "http://localhost:3003/api/menu", // URL base de la API
      products: [], // Lista de productos
      filteredProducts: [], // Productos filtrados
      searchQuery: "", // Texto de búsqueda
      showModal: false, // Controla la visibilidad del modal
      isEditing: false, // Indica si se está editando un producto
      currentProduct: { _id: null, name: "", price: 0, category: "", stock: 0, image: "" }, // Producto actual
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
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    },
    showProductForm() {
      this.showModal = true;
      this.isEditing = false;
      this.currentProduct = { _id: null, name: "", price: 0, category: "", stock: 0, image: "" };
    },
    hideProductForm() {
      this.showModal = false;
    },
    async saveProduct() {
      try {
        if (this.isEditing) {
          // Actualizar producto
          await axios.put(`${this.apiUrl}/${this.currentProduct._id}`, this.currentProduct);
          alert("Producto actualizado con éxito.");
        } else {
          // Crear producto
          const formData = new FormData();
          Object.entries(this.currentProduct).forEach(([key, value]) =>
            formData.append(key, value)
          );
          await axios.post(this.apiUrl, formData);
          alert("Producto creado con éxito.");
        }
        this.loadProducts();
        this.hideProductForm();
      } catch (error) {
        console.error("Error al guardar el producto:", error);
      }
    },
    editProduct(product) {
      this.currentProduct = { ...product };
      this.isEditing = true;
      this.showModal = true;
    },
    async deleteProduct(productId) {
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
          await axios.delete(`${this.apiUrl}/${productId}`);
          alert("Producto eliminado con éxito.");
          this.loadProducts();
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
        }
      }
    },
    async updateStock(productId, change) {
      try {
        const product = this.products.find((p) => p._id === productId);
        const newStock = Math.max(0, product.stock + change);
        await axios.put(`${this.apiUrl}/${productId}`, { stock: newStock });
        product.stock = newStock;
      } catch (error) {
        console.error("Error al actualizar el stock:", error);
      }
    },
    handleImageUpload(event) {
      this.currentProduct.image = event.target.files[0];
    },
  },
  mounted() {
    this.loadProducts();
  },
};
</script>

<style scoped>
/* Contenedor central */
.center-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    /* Para centrar verticalmente en la pantalla */
    padding: 20px;
    box-sizing: border-box;
    margin: 0 auto;
}

.top-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

/* Search Bar Styles */
.search-container {
    margin-bottom: 20px;
    /* Space between search bar and table */
    display: flex;
    /* Flexbox for alignment */
    justify-content: center;
    /* Center the search bar */
    align-items: center;

}

#searchBar {
    padding: 10px;
    /* Padding for better touch target */
    font-size: 16px;
    /* Font size */
    border: 1px solid #ddd;
    /* Light border */
    border-radius: 4px;
    /* Rounded corners */
    width: 300px;
    /* Fixed width or change to 100% for full-width */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* Subtle shadow */
}

/* Optional: Focus Effect */
#searchBar:focus {
    border-color: #4CAF50;
    /* Change border color on focus */
    outline: none;
    /* Remove default outline */
}

.top-bar-search {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

/* Estilo general para botones */
button,
.add-product-btn,
.add-category-btn,
.btn-primary,
.btn-secondary,
.product-table button {
    padding: 10px 20px;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px;
    /* Espaciado entre botones */
    transition: background-color 0.2s;
}

button:hover,
.add-product-btn:hover,
.add-category-btn:hover,
.product-table .edit-btn:hover,
.product-table .delete-btn:hover,
.btn-primary:hover,
.btn-secondary:hover {
    background-color: #98dbbc;
    /* Color más oscuro al pasar el mouse */
}

/* Estilo para el botón de eliminar */
.product-table .delete-btn {
    background-color: #f44336;
    /* Color rojo */
}

.product-table .delete-btn:hover {
    background-color: #d32f2f;
    /* Color más oscuro al pasar el mouse */
}

/* Contenedor de la tabla de productos */
.product-table {
    width: 100%;
    max-width: 1200px;
    /* Aumenta el ancho máximo para pantallas grandes */
    margin: 20px auto;
    /* Centra la tabla */
    border-collapse: collapse;
    font-family: Arial, sans-serif;
}

/* Encabezados y celdas de la tabla */
.product-table th,
.product-table td {
    padding: 12px;
    border: 1px solid #ddd;
    /* Añadir borde para alineación */
    text-align: left;
    font-size: 14px;
    /* Ajusta el tamaño de fuente si es necesario */
}

.product-table th {
    background-color: #4CAF50;
    color: white;
}

.product-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.product-table tr:hover {
    background-color: #f1f1f1;
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
#productForm h2 {
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

/* Botones del formulario */
.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn-primary {
    flex: 1;
    margin-right: auto;
}

.btn-secondary {
    flex: 1;
    margin-left: auto;
}









/* Global Styles */
body {
    font-family: 'Arial', sans-serif;
    /* Main font */
    font-size: 16px;
    /* Base font size */
    color: #333;
    /* Text color */
    line-height: 1.5;
    /* Improve readability */
    margin: 0;
    /* Remove default margin */
    padding: 20px;
    /* Add some padding */
    background-color: #f9f9f9;
    /* Light background color */
}

/* Table Styles */
.product-table {
    width: 100%;
    max-width: 1200px;
    /* Aumenta el ancho máximo para pantallas grandes */
    margin: 20px auto;
    /* Centra la tabla */
    border-collapse: collapse;
    font-family: 'Arial', sans-serif;
    /* Ensure table uses the same font */
}

/* Table Headers */
.product-table th {
    background-color: #4CAF50;
    /* Green background */
    color: white;
    /* White text */
    padding: 12px;
    /* Padding for headers */
}

/* Table Data */
.product-table td {
    padding: 12px;
    /* Padding for cells */
    border: 1px solid #ddd;
    /* Border for cells */
}

/* Action Buttons */
.product-table button {
    padding: 10px 15px;
    /* Padding for buttons */
    font-size: 14px;
    /* Font size for buttons */
    border: none;
    border-radius: 5px;
    /* Rounded corners */
    cursor: pointer;
    transition: background-color 0.3s;
}

/* Other Button Styles (edit, delete) */
.product-table .edit-btn {
    background-color: #4CAF50;
    /* Green button */
    color: white;
    /* White text */
}

.product-table .delete-btn {
    background-color: #f44336;
    /* Red button */
    color: white;
    /* White text */
}

/* Estilos para el modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: #fff;
    margin: 10% auto;
    padding: 20px;
    width: 300px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
    float: right;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
}

.add-user-btn {
    margin-top: 20px;
}
</style>