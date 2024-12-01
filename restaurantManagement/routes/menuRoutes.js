const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../upload'); // Middleware para manejar archivos
const { createMenuItem } = require('../controllers/menuController');


// Ruta para obtener todos los elementos del menú
router.get('/', menuController.getAllMenuItems);
router.post('/', upload.single('image'), createMenuItem);

router.put('/:identifier', upload.single('image'), menuController.updateMenuItemByIdentifier);

router.get('/:identifier', menuController.getMenuItemByIdentifier);
router.delete('/:id', menuController.deleteMenuItem);



router.get('a/', menuController.getProductsByCategory);



module.exports = router;