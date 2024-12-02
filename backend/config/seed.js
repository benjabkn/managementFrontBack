const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem'); // Asegúrate de que la ruta sea correcta

// Conexión a MongoDB
mongoose.connect('mongodb+srv://benja856:benja123456@cluster1.pxar9.mongodb.net/restaurantDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Datos de ejemplo para poblar la base de datos
const menuItems = [
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta and cheese',
    price: 12.99,
    category: 'Main Course'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil',
    price: 9.99,
    category: 'Main Course'
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 7.99,
    category: 'Appetizer'
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with mascarpone and coffee',
    price: 6.99,
    category: 'Dessert'
  }
];

// Poblar la base de datos
async function seedDatabase() {
  try {
    await MenuItem.deleteMany(); // Elimina cualquier dato previo
    await MenuItem.insertMany(menuItems);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión después de poblar la base de datos
  }
}

seedDatabase();