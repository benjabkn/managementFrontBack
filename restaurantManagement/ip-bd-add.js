require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');

const addCurrentIPToMongoAtlas = async () => {
  try {
    // Obtener la IP pública actual
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const currentIp = ipResponse.data.ip;
    console.log(`IP actual: ${currentIp}`);

    // Ejecutar el comando CLI de MongoDB Atlas con la IP actual
    exec(`atlas accessLists create ${currentIp}/32`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el comando: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Salida: ${stdout}`);
    });
  } catch (error) {
    console.error('Error al obtener la IP o al ejecutar el comando CLI:', error.message);
  }
};

addCurrentIPToMongoAtlas();


