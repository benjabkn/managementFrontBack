const MenuItem = require('../models/MenuItem');
const Category = require("../models/Category");

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; // Asegúrate de configurar Cloudinary en otro archivo si no lo has hecho

// Obtener todos los elementos del menú
exports.getAllMenuItems = async (req, res) => {
    console.log(req.query)
    try {
        const menuItems = await MenuItem.find().populate('category', 'name');
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Método para crear un nuevo elemento en el menú
exports.createMenuItem = async (req, res) => {
    try {
        // Validar que la categoría existe
        const categoryId = req.body.category;
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({
                message: "Invalid category ID. The category does not exist.",
            });
        }

        // Manejar la subida de la imagen (opcional)
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "menu_items",
                use_filename: true,
                unique_filename: false,
            });
            imageUrl = result.secure_url;
        }

        // Crear el item de menú con la categoría
        const newItem = await MenuItem.create({
            name: req.body.name.trim(),
            price: parseFloat(req.body.price),
            category: categoryId, // Asocia el item a la categoría existente
            stock: parseInt(req.body.stock) || 0,
            image: imageUrl,
        });

        res.status(201).json({
            message: "New menu item successfully created!",
            item: newItem,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error creating menu item",
            error: error.message,
        });
    }
};


exports.updateMenuItemByIdentifier = async (req, res) => {
    const { identifier } = req.params;
    const updateData = { ...req.body }; // Copiar datos del cuerpo de la solicitud
    console.log(req.body)
    try {
        let item;

        // Buscar el producto por ID o por nombre para manejar la imagen anterior
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            item = await MenuItem.findById(identifier);
        }
        if (!item) {
            item = await MenuItem.findOne({ name: identifier });
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Si hay una imagen en la solicitud, súbela a Cloudinary
        if (req.file) {
        console.log("Subiendo nueva imagen:", req.file);

            // Elimina la imagen anterior si existe
            if (item.image) {
                const publicId = item.image.split('/').pop().split('.')[0]; // Extraer el public_id
                await cloudinary.uploader.destroy(`menu_items/${publicId}`);
            }

            // Subir la nueva imagen
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'menu_items',
                use_filename: true,
                unique_filename: false,
            });
            updateData.image = result.secure_url; // Guardar la nueva URL de la imagen
        }

        // Actualizar el producto con los nuevos datos
        const updatedItem = await MenuItem.findByIdAndUpdate(item._id, updateData, { new: true });

        // Devolver el producto actualizado
        res.status(200).json({
            message: 'Menu item updated successfully!',
            item: updatedItem,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating item',
            error: error.message,
        });
    }
};

// Método para eliminar un producto en el menú
exports.deleteMenuItem = async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({
            message: 'Menu item deleted successfully!',
            item: deletedItem
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getMenuItemByIdentifier = async (req, res) => {
    const { identifier } = req.params;

    try {
        let item;

        // Verifica si identifier es un ObjectId válido
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            item = await MenuItem.findById(identifier);
        }

        // Si no es un ObjectId válido, busca por nombre
        if (!item) {
            item = await MenuItem.findOne({ name: identifier });
        }

        // Si no se encuentra el producto, devuelve un 404
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Si se encuentra, devuelve el producto
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving item', error: error.message });
    }
};



exports.getCategories = async (req, res) => {
    try {
        // Verifica si hay documentos en la colección
        const itemsCount = await MenuItem.countDocuments();
        if (itemsCount === 0) {
            return res.status(404).json({ message: 'No items found in the collection' });
        }

        // Obtiene las categorías únicas
        const categories = await MenuItem.distinct("category");

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        // Responde con las categorías
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.body;  // Obtener categoryId desde el cuerpo de la solicitud
    console.log(req.body)
    if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' });
    }

    try {
        // Verificar si la categoría existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Obtener todos los productos que pertenecen a esta categoría
        const menuItems = await MenuItem.find({ category: categoryId }).populate('category', 'name');

        if (menuItems.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }

        // Devolver los productos encontrados
        res.status(200).json(menuItems);
    } catch (error) {
        // Devolver el error real en lugar de un mensaje estático
        res.status(500).json({ error: error.message });
    }
};