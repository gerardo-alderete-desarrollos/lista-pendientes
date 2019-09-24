// Requires

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cors = require('cors');
var enviorement = require('./assets/envioremet');

//Inicializar variables
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Importar rutas
var appRoutes = require('./routes/app');
var listaPendiente = require('./routes/lista');

// Conexión a la base de datos local
mongoose.connection.openUri('mongodb://localhost:27017/listaPendientesBD', (err, res) => {

    if (err) {
        console.log('error:', error);
        throw err;

    }

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});


// Rutas
app.use('/lista-pendiente', listaPendiente);
app.use('/', appRoutes);

// Inicializacion del servidor
app.listen(4001, (err) => {
    if (err) {
        throw err;
    }
    console.log('Express server http://localhost:4001/lista-pendiente/ online');
});