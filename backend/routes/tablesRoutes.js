// routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tablesController');

// Get all tables
router.get('/tables', tableController.getAllTables);

// Get a table by ID
router.get('/tables/:id', tableController.getTableById);

// Create a new table
router.post('/tables', tableController.createTable);

// Update a table
router.put('/tables/:id', tableController.updateTable);

// Delete a table
router.delete('/tables/:id', tableController.deleteTable);

// Get available tables
router.get('/tables/chekcTables/available/', tableController.getAvailableTablesAtTime);
module.exports = router;
