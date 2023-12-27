var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo : {type: String, required: true},
    slug : {type: String, required: true},
    categoria : {type: String, required: true},
    subcategoria : {type: String, required: true},
    precio : {type: Number, default: 0, required: true},
    extracto : {type: String, required: true},
    portada : {type: String, required: true},
    stock : {type: Number, default: 0 , required: true},
    str_variedad : {type: String, required: true},
    estado : {type: Boolean, required: true},
    descuento : {type: Boolean, required: true},
    updatedAt : {type: Date, required: false},
    createdAt : {type: Date, default: Date.now}
});

module.exports = mongoose.model('producto',ProductoSchema);