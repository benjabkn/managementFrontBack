// controllers/categoryController.js
const Category = require('../models/Category');
const mongoose = require('mongoose');


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Obtiene todas las categorías de la base de datos
        res.status(200).json(categories); // Envía las categorías en formato JSON con un estado 200
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Implementa getCategoryById, updateCategory y deleteCategory de manera similar

// deleteCategory method 
// controllers/categoryController.js

// Eliminar una categoría por su ID
exports.deleteCategory = async (req, res) => {
    try {
        const deletedItem = await Category.findByIdAndDelete(req.params.id);
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