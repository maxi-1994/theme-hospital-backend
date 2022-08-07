require('dotenv').config(); // Por defecto buscará un archivo con la extención .env y lo establecerá en las variables de entorno de node.
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Server
const app = express();

// Middlewares
// CORS - Los CORS sirven para hacer las configuraciónes en el servidor para que acepte peticiones de diferentes dominios.
app.use(cors());
// Lectura y parseo del body
app.use(express.json());

// Data Base
dbConnection();

// Routes
app.use('/api/users', require('./routes/users-routes'));
app.use('/api/login', require('./routes/auth-routes'));


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});