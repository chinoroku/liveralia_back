var express = require('express');
var notacreditoController = require('../controllers/notacreditoController');
var authenticate = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');

var api = express.Router();


api.get('/listar_clientes_devolucion',authenticate.decodeToken, notacreditoController.listar_clientes_devolucion);
api.get('/listar_ventas_clientes/:_id',authenticate.decodeToken,notacreditoController.listar_ventas_clientes);
api.get('/listar_detalle_ventas/:_id',authenticate.decodeToken,notacreditoController.listar_detalle_ventas);
api.post('/registro_devolucion_admin', authenticate.decodeToken, notacreditoController.registro_devolucion_admin);


module.exports = api;