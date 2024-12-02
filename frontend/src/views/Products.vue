<template>
    <div class="container">
        <div class="tittle">
            <h1>Catálogo de Productos</h1>
        </div>

        <!-- Filtros por categoría como botones (toggle) -->
        <div class="filters">
            <button v-for="category in categories" :key="category" @click="toggleFilter(category)"
                :class="{ 'active': selectedCategories.includes(category) }">
                {{ category }}
            </button>
        </div>

        <!-- Componente de búsqueda -->
        <div class="product-table">
            <div class="search-component">
                <input class="top-bar-search" placeholder="Buscar producto por nombre" v-model="searchQuery"
                    @input="debouncedFilterProducts" />
            </div>
        </div>

        <!-- Mensaje de carga -->
        <div v-if="loading" class="loading">
            <p>Cargando productos...</p>
        </div>

        <!-- Mensaje cuando no se encuentran productos -->
        <div v-if="!filteredProducts.length && !loading" class="no-products">
            <p>No se encontraron productos.</p>
        </div>

        <!-- Galería de productos -->
        <div class="gallery">
            <div v-for="product in filteredProducts" :key="product.id" class="product">
                <img :src="product.image" :alt="product.name" />
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <p v-if="product.category && product.category.name">{{ product.category.name }}</p>
                <p v-else>No disponible</p>
                <p>{{ product.stock }} disponibles</p>
                <p><strong>${{ product.price }}</strong></p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
    name: "ProductsView",
    data() {
        return {
            products: [], // Todos los productos
            filteredProductsList: [], // Lista de productos filtrados
            categories: [], // Lista de categorías (solo nombres)
            selectedCategories: [], // Categorías seleccionadas para el filtro
            searchQuery: "", // Texto de búsqueda
            apiUrl: "http://localhost:3003/api/menu", // URL base de la API
            loading: false, // Indicador de carga
        };
    },
    computed: {
        // Filtrar productos según la categoría seleccionada y la búsqueda
        filteredProducts() {
            let filtered = this.filteredProductsList;

            // Filtrar productos según las categorías seleccionadas
            if (this.selectedCategories.length > 0) {
                filtered = filtered.filter(product =>
                    product.category && product.category.name && this.selectedCategories.includes(product.category.name)
                );
            }

            // Filtrar productos según la búsqueda
            if (this.searchQuery) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (product.category && product.category.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
                );
            }

            return filtered;
        },
    },
    methods: {
        async loadProducts() {
            this.loading = true;
            try {
                const response = await axios.get(this.apiUrl);
                this.products = response.data;
                this.filteredProductsList = [...this.products]; // Inicializar lista filtrada

                // Extraer categorías únicas de los productos
                this.categories = [
                    ...new Set(
                        this.products
                            .map(product => product.category && product.category.name ? product.category.name : null)
                            .filter(category => category !== null)
                    ),
                ];
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                this.loading = false;
            }
        },

        // Usar debounce para optimizar el filtrado en la búsqueda
        debouncedFilterProducts: debounce(function () {
            this.filterProducts();
        }, 300), // 300ms de retraso
        filterProducts() {
            const query = this.searchQuery.toLowerCase();
            this.filteredProductsList = this.products.filter((product) => {
                const category = product.category && product.category.name ? product.category.name.toLowerCase() : '';
                return (
                    product.name.toLowerCase().includes(query) ||
                    category.includes(query)
                );
            });
        },

        toggleFilter(category) {
            const index = this.selectedCategories.indexOf(category);
            if (index > -1) {
                this.selectedCategories.splice(index, 1); // Eliminar categoría
            } else {
                this.selectedCategories.push(category); // Añadir categoría
            }
        },
        clearFilter() {
            this.selectedCategories = []; // Limpiar los filtros
        }
    },
    mounted() {
        this.loadProducts(); // Cargar productos al montar el componente
    },
};
</script>

<style scoped>
.container {
    max-width: 80%;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow-x: auto;
}

.tittle {

    text-align: center;
    margin-bottom: 20px;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}

.product {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    background-color: #f9f9f9;
}

.product img {
    max-width: 100%;
    height: auto;
}

.product h3 {
    font-size: 1.2em;
    margin: 10px 0;
}

.filters {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
    padding: 10px;
}

.filters button {
    padding: 10px 20px;
    font-size: 1em;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.filters button:hover {
    background-color: #e0e0e0;
}

.filters button.active {
    background-color: #007bff;
    color: white;
}

.top-bar-search {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.search-component {
    display: flex;
    align-items: flex-end;
    max-width: 200px;
    justify-content: center;
    padding-left: 50px;
}

.loading {
    text-align: center;
    padding: 20px;
}

.no-products {
    text-align: center;
    padding: 20px;
    color: #777;
}
</style>