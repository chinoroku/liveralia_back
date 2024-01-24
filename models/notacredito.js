var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotaCreditoSchema = Schema({
    serie : {type: String, required: true},
    total : {type: Number, required: true},
    estado : {type: String, required: true,default: true},
    cliente : {type: Schema.ObjectId, ref: 'cliente', required: true},
    createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('notacredito',NotaCreditoSchema);