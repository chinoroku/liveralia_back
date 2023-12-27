var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubcategoriaSchema = Schema({
    titulo : {type: String, required: true},
    categoria : {type: Schema.ObjectId, ref:'categoria' ,required: true},
    createdAt : {type: Date, default: Date.now}
});

module.exports = mongoose.model('subcategoria',SubcategoriaSchema);