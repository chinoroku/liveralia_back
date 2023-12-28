var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({
    nombre : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    celular : {type: String, required: true, unique: true},
    estado : {type: Boolean, default: true , required: true},
    createdAt : {type: Date, default: Date.now}
});

module.exports = mongoose.model('proveedor',ProveedorSchema);