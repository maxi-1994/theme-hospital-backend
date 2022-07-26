require('dotenv').config(); // Por defecto buscará un archivo con la extención .env y lo establecerá en las variables de entorno de node.
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Server
const app = express();

// Los CORS sirven para hacer las configuraciónes en el servidor para que acepte peticiones de diferentes dominios.
// CORS
app.use(cors());

// Data Base
dbConnection();

// Routes
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });

});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});