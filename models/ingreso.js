var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngresoSchema = Schema({
    proveedor : {type: String, required: true}, //F
    ncomprobante : {type: String, required: true}, //F
    documento : {type: String, required: true}, //F

    monto_total : {type: String, required: true}, //F
    serie : {type: Number, required: true}, //NF
    monto_resultante : {type: String, required: true}, //NF
    usuario: {type: Schema.ObjectId, ref: 'usuario', required: true}, //NF
    createdAt : {type: Date, default: Date.now},

});

module.exports = mongoose.model('ingreso',IngresoSchema);