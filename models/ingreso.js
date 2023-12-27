var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngresoSchema = Schema({
    nombres : {type: String, required: true},
    apellidos : {type: String, required: false},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    estado : {type: Boolean, default: true},
    createdAt : {type: Date, default: Date.now},

    pais : {type: String, required: false},
    recovery : {type: String, required: false},
    genero : {type: String, required: false},
});

module.exports = mongoose.model('ingreso',IngresoSchema);