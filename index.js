require('dotenv').config(); // Por defecto buscará un archivo con la extención .env y lo establecerá en las variables de entorno de node.
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const baseUrl = require('./helpers/constants');

// Server
const app = express();

// Middlewares
// CORS - Los CORS sirven para hacer las configuraciónes en el servidor para que acepte peticiones de diferentes dominios.
app.use(cors());

// Public folder -> muestra el archivo index.html en la ruta local
app.use(express.static('public')); // Para generar prueba de la request del login de google 

// Lectura y parseo del body
app.use(express.json());

// Data Base
dbConnection();

// Routes
app.use(baseUrl.usersURL, require('./routes/users-routes'));
app.use(baseUrl.hospitalsURL, require('./routes/hospitals-routes'));
app.use(baseUrl.medicsURL, require('./routes/medics-routes'));
app.use(baseUrl.loginURL, require('./routes/auth-routes')); 
app.use(baseUrl.allURL, require('./routes/search-routes'));
app.use(baseUrl.uploadURL, require('./routes/uploads-routes'));

// Si la ruta no es ninguna de las principales, se construirá el path requerido. ej: http://localhost:4200/dashboard/progress -> "/progress" escrito a mano en la url de la web
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});