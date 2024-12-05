// controllers/zoneController.js
const Zone = require('../models/Zones');

exports.getAllZones = async (req, res) => {
    try {
        const zones = await Zone.find();
        res.status(200).json(zones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching zones.' });
    }
};
// controllers/zoneController.js
exports.createZone = async (req, res) => {
    const { name, description, capacity } = req.body;
    try {
        const newZone = new Zone({
            name,
            description,
            capacity
        });

        await newZone.save();
        res.status(201).json({ message: 'Zone created successfully', zone: newZone });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating zone.' });
    }
};
