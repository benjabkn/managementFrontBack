// controllers/tableController.js
const Table = require('../models/Table');
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');  // Ajusta la ruta según tu

// Get all tables
exports.getAllTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.status(200).json(tables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tables.' });
    }
};

// Get a table by its ID
exports.getTableById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {  // Validar que el id sea un ObjectId válido
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        console.log(id);
        
        
        const table = await Table.findById(id);
        
        
        if (!table) {
            return res.status(404).json({ message: 'Table not found.' });
        }
        res.status(200).json(table);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching table.' });
    }
};

// Create a new table
exports.createTable = async (req, res) => {
    const { tableNumber, ability, isAvailable, area } = req.body;

    try {
        // Verificar si ya existe una mesa con el mismo número
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ message: 'A table with this number already exists.' });
        }

        const newTable = new Table({
            tableNumber,
            ability,
            isAvailable,
            area
        });

        await newTable.save();
        res.status(201).json({ message: 'Table created successfully', table: newTable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating table.' });
    }
};

// Update a table
exports.updateTable = async (req, res) => {
    const { id } = req.params;
    const { tableNumber, ability, isAvailable, area } = req.body;

    try {
        const updatedTable = await Table.findByIdAndUpdate(
            id,
            { tableNumber, ability, isAvailable, area },
            { new: true }
        );

        if (!updatedTable) {
            return res.status(404).json({ message: 'Table not found.' });
        }

        res.status(200).json({ message: 'Table updated successfully', table: updatedTable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating table.' });
    }
};

// Delete a table
exports.deleteTable = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTable = await Table.findByIdAndDelete(id);

        if (!deletedTable) {
            return res.status(404).json({ message: 'Table not found.' });
        }

        res.status(200).json({ message: 'Table deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting table.' });
    }
};

exports.checkTableAvailability = async (tableId, startTime, endTime) => {
    // Verifica si la mesa está disponible en el rango de tiempo solicitado
    const table = await Table.findById(tableId);
    
    if (!table || !table.isAvailable) {
      return false;  // Mesa no disponible
    }
  
    // Busca si ya existe una reserva que se solape con el rango de tiempo
    const existingReservations = await Reservation.find({
      tableId: tableId,
      $or: [
        { startDate: { $lt: endTime, $gte: startTime } },  // El inicio de la reserva es antes del fin, pero termina después del inicio
        { endDate: { $gt: startTime, $lte: endTime } },    // El final de la reserva es después del inicio, pero empieza antes del fin
        { startDate: { $gte: startTime, $lte: endTime } },  // La reserva está completamente dentro del rango solicitado
        { endDate: { $gte: startTime, $lte: endTime } }     // La reserva se solapa con el rango solicitado
      ]
    });
  
    // Si no hay reservas solapadas, la mesa está disponible
    return existingReservations.length === 0;
  };
  

  exports.getAvailableTablesAtTime = async (req, res) => {
    const { startTime, endTime } = req.body;  // startTime y endTime deben ser Date
    try {
      if (isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
      const availableTables = [];
      
      // Obtén todas las mesas
      const tables = await Table.find();
  
      // Recorre todas las mesas y verifica si están disponibles en el rango de tiempo
      for (let table of tables) {
        const isAvailable = await exports.checkTableAvailability(table._id, new Date(startTime), new Date(endTime));
  
        if (isAvailable) {
          availableTables.push(table);  // Si la mesa está disponible, agrégala a la lista
        }
      }
  
      // Si no hay mesas disponibles
      if (availableTables.length === 0) {
        return res.status(404).json({ message: 'No tables available at this time' });
      }
  
      return res.status(200).json(availableTables);  // Devuelve las mesas disponibles
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error checking availability' });
    }
  };
  