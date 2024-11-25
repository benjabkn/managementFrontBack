const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');



// Ruta para obtener los elementos del menú por categoría
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);

router.get('/:id', categoryController.getCategoryById);

router.delete('/:id', categoryController.deleteCategory);

router.put('/:id', categoryController.updateCategory);

module.exports = router;