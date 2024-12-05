const { response } = require('express');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const Zone = require('../models/Zones'); // Importar el modelo de Zone
const mongoose = require('mongoose');

// Función para verificar la disponibilidad de la mesa en el rango de fechas
exports.checkTableAvailability = async (tableId, startTime, endTime) => {
    try {
      // Verificar si ya existen reservas que se solapen con el rango solicitado
      const overlappingReservations = await Reservation.find({
        tableId: tableId,
        $or: [
          // Si la nueva reserva comienza antes de que termine una existente
          { startDate: { $lt: endTime }, endDate: { $gte: startTime } },
          // Si la nueva reserva termina después de que comienza una existente
          { startDate: { $lte: endTime }, endDate: { $gte: startTime } },
        ],
      });
  
      // Si existe alguna reserva que se solape, no está disponible
      return overlappingReservations.length === 0;
    } catch (error) {
      console.error(error);
      throw new Error('Error checking table availability');
    }
  };

  exports.createReservation = async (req, res) => {
    const {numberOfPeople, startDate, endDate, zone, tableId, name} = req.body;  // Obtener los datos de la reserva
    console.log(req.body);
    try {
      // Verificar la disponibilidad de la mesa
      const isAvailable = await exports.checkTableAvailability(
        tableId,
        new Date(startDate),
        new Date(endDate)
      );
  
      if (!isAvailable) {
        return res.status(400).json({ message: 'The table is not available at this time' });
      }
  
      // Crear la reserva si la mesa está disponible
      const newReservation = new Reservation({
        tableId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        zone,
        numberOfPeople,
        name
      });
      
      await newReservation.save();
  
      return res.status(200).json(newReservation); // Responder con la reserva creada
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating reservation' });
    }
  };




exports.getReservations = async (req, res) => {
    try {
        // Obtener todas las reservas y poblar los detalles de la mesa y la zona
        const reservations = await Reservation.find()
            .populate('tableId', 'tableNumber ability isAvailable area') // Poblar mesa
            .populate('zone', 'name description capacity'); // Poblar zona

        // Si no hay reservas
        if (reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        // Devolver las reservas con los objetos de mesa y zona poblados
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReservation = async (req, res) => {
    const { reservationId } = req.params;
    const { numberOfPeople, startDate, endDate, zone, tableId, name } = req.body;

    try {
        // Convertir las fechas de texto a objetos Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validar las fechas
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format. Please use a valid date format.' });
        }

        // Buscar la reserva por ID
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Si la mesa se está cambiando, comprobar si la nueva mesa está disponible
        if (reservation.tableId.toString() !== tableId.toString()) {
            const isTableAvailable = await exports.checkTableAvailability(tableId, start, end);

            if (!isTableAvailable) {
                return res.status(400).json({ message: 'The table is not available during this time.' });
            }

            // Actualizar la disponibilidad de la mesa anterior a "disponible"
            await Table.findByIdAndUpdate(reservation.tableId, { isAvailable: true });

            // Actualizar la disponibilidad de la nueva mesa a "no disponible"
            await Table.findByIdAndUpdate(tableId, { isAvailable: false });
        }

        // Verificar si la nueva zona existe
        if (zone && !mongoose.Types.ObjectId.isValid(zone)) {
            const zoneExists = await Zone.findById(zone);
            if (!zoneExists) {
                return res.status(404).json({ message: 'Zone not found.' });
            }
        }

        // Actualizar la reserva
        reservation.numberOfPeople = numberOfPeople || reservation.numberOfPeople;
        reservation.startDate = start;
        reservation.endDate = end;
        reservation.zone = zone || reservation.zone;
        reservation.tableId = tableId || reservation.tableId;
        reservation.name = name || reservation.name;

        await reservation.save();

        return res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating reservation' });
    }
};

exports.deleteReservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        // Buscar la reserva por ID
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Obtener el ID de la mesa asociada a la reserva
        const tableId = reservation.tableId;

        // Eliminar la reserva
        await Reservation.findByIdAndDelete(reservationId);

        // Marcar la mesa como disponible
        await Table.findByIdAndUpdate(tableId, { isAvailable: true });

        return res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting reservation' });
    }
};

// Endpoint para obtener las zonas de las reservas
exports.getZonesFromReservations = async (req, res) => {
    try {
        // Obtener todas las reservas, solo el campo 'zone'
        const reservations = await Reservation.distinct('zone');
        
        // Si no se encuentran zonas
        if (!reservations.length) {
            return res.status(404).json({ message: 'No zones found in reservations' });
        }

        // Devolver las zonas encontradas
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching zones from reservations.' });
    }
};

