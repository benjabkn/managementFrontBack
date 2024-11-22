
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'deyvqcipa',
  api_key: '316759431425828',
  api_secret: 'epG9UEVmYC2MFIUAeHBYLs6shJw'
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'menu_items',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage });

module.exports = upload;