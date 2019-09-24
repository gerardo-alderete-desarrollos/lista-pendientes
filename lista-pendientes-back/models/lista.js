var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ListaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la lista de pendientes es necesario'] },
    isTerminado: { type: Boolean, required: false, default: false },
    fechaCreacion: { type: Date, required: false },
    fechaTermino: { type: Date, required: false }
});

var Lista = mongoose.model('Lista', ListaSchema);
module.exports = Lista;