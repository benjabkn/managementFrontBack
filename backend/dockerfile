# Usa una imagen oficial de Node.js
FROM node:latest

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Exponer el puerto de la aplicación (asegúrate de que coincida con el de tu app)
EXPOSE ${PORT}

# Define el comando para iniciar la aplicación
CMD ["node", "server.js"]
