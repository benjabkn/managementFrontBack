// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const dayjs = require('dayjs'); // Importamos Day.js
const mongoose = require('mongoose');


// Crear una cita
exports.createAppointment = async (req, res) => {
    try {
        const { title, description, startDate, endDate, userId } = req.body;

        // Validación de campos obligatorios
        if (!title || !description || !startDate || !endDate || !userId) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar si userId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'El userId proporcionado no es válido' });
        }

        // Convertir las fechas recibidas a objetos Date de JavaScript
        const start = new Date(startDate);  // Crear objeto Date a partir de la fecha
        const end = new Date(endDate);      // Crear objeto Date a partir de la fecha

        // Verificar si las fechas son válidas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'El formato de la fecha es incorrecto' });
        }

        // Validaciones adicionales de fechas
        const now = new Date();


        if (end <= start) {
            return res.status(400).json({ message: 'La fecha de finalización debe ser posterior a la de inicio' });
        }

        // Validación de solapamiento de citas
        const existingAppointments = await Appointment.find({
            user: userId,
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } }, // La cita existente se solapa con la nueva
            ],
        });

        if (existingAppointments.length > 0) {
            return res.status(400).json({ message: 'Ya existe una cita en este horario' });
        }

        // Buscar al usuario en la base de datos por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Crear la cita y asociarla con el usuario
        const appointment = new Appointment({
            title,
            description,
            startDate,  // Almacenar como Date
            endDate,      // Almacenar como Date
            user: userId,      // Asociar con el usuario
        });

        await appointment.save();

        // Formatear las fechas antes de devolver la respuesta (en formato DD-MM-YYYY HH:mm)
        const formattedAppointment = {
            ...appointment.toObject(),
            startDate: start.toLocaleString('es-ES'),  // Formato DD-MM-YYYY HH:mm
            endDate: end.toLocaleString('es-ES'),      // Formato DD-MM-YYYY HH:mm
        };

        res.status(201).json({ message: 'Cita creada con éxito', appointment: formattedAppointment });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error al crear la cita', error });
    }
};


// Obtener todas las citas de un usuario
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.params.userId });

        // Formatear las fechas antes de devolverlas en la respuesta
        const formattedAppointments = appointments.map(appointment => {
            return {
                ...appointment.toObject(),
                startDate: dayjs(appointment.startDate).format('DD-MM-YYYY HH:mm'),
                endDate: dayjs(appointment.endDate).format('DD-MM-YYYY HH:mm'),
            };
        });

        res.status(200).json(formattedAppointments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las citas', error });
    }
};

// Obtener todas las citas
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No hay citas' });
        }

        // Formatear las fechas antes de devolverlas en la respuesta
        const formattedAppointments = appointments.map(appointment => {
            return {
                ...appointment.toObject(),
                startDate: dayjs(appointment.startDate).format('DD-MM-YYYY HH:mm'),
                endDate: dayjs(appointment.endDate).format('DD-MM-YYYY HH:mm'),
            };
        });

        res.status(200).json(formattedAppointments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las citas', error });
    }
};

// Actualizar una cita
exports.updateAppointment = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;

        // Usamos Day.js para verificar las fechas al actualizar
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        // Validación de fechas


        if (end.isBefore(start)) {
            return res.status(400).json({ message: 'La fecha de finalización debe ser posterior a la de inicio' });
        }

        // Actualizar la cita
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                startDate: start.toDate(),  // Convertir a Date
                endDate: end.toDate(),      // Convertir a Date
            },
            { new: true }
        );

        // Formatear las fechas antes de devolver la respuesta
        const formattedAppointment = {
            ...updatedAppointment.toObject(),
            startDate: dayjs(updatedAppointment.startDate).format('DD-MM-YYYY HH:mm'),
            endDate: dayjs(updatedAppointment.endDate).format('DD-MM-YYYY HH:mm'),
        };

        res.status(200).json({ message: 'Cita actualizada', updatedAppointment: formattedAppointment, startDate, endDate });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cita', error });
    }
};

// Eliminar una cita
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        startDate = dayjs(appointment.startDate).format('DD-MM-YYYY HH:mm')
        endDate = dayjs(appointment.endDate).format('DD-MM-YYYY HH:mm')
        if (!appointment) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }
        
        res.status(200).json({ message: 'Cita eliminada', startDate, endDate });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la cita', error });
    }
};
