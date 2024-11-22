<template>
    <div>
        <h1>Catálogo de Productos</h1>

            <!-- Galería de productos -->
        <div class="gallery">
            <div v-for="product in products" :key="product.id" class="product">
                <img :src="product.image" :alt="product.name" />
                <h3>{{ product.name }}</h3>
                <p>{{ product.description }}</p>
                <p><strong>${{ product.price }}</strong></p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ProductsView",
    data() {
        return {
            products: [],

            apiUrl: "http://localhost:3003/api/menu", // URL base de la API

        };
    },
    methods: {
        async loadProducts() {
            try {
                const response = await axios.get(this.apiUrl);
                this.products = response.data;
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        },
    },
    mounted() {
        this.loadProducts(); // Cargar usuarios al montar el componente
    },
};
</script>


<style scoped>
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
</style>