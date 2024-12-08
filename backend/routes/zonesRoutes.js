// routes/zoneRoutes.js
const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zonesController');

// Rutas para obtener y crear zonas
router.get('/zones', zoneController.getAllZones);
router.post('/zones', zoneController.createZone);

module.exports = router;
