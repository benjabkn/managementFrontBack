const Category = require('../models/Category');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  console.log(req.body);
  try {
    // Validar que la categoría tenga un nombre
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    // Crear una nueva categoría
    const category = new Category({ name: req.body.name.trim() });

    // Guardar la categoría en la base de datos
    await category.save();

    // Responder con la categoría recién creada
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creando la categoría:', error);

    // Si es un error de validación de Mongoose (por ejemplo, campos requeridos no proporcionados)
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Error de validación.',
        error: error.message,
      });
    }

    // Errores de base de datos o de servidor
    if (error.name === 'MongoError' || error.name === 'MongooseError') {
      return res.status(500).json({
        message: 'Error en la base de datos.',
        error: error.message,
      });
    }

    // Otros errores no controlados
    return res.status(500).json({
      message: 'Error creando la categoría',
      error: error.message,
    });
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error: error.message });
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
