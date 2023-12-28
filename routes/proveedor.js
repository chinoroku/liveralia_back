var express = require('express');
var proveedorController = require('../controllers/proveedorController');
var authenticate = require('../middlewares/authenticate');

var api = express.Router();

api.post('/registro_proveedor_admin', authenticate.decodeToken, proveedorController.registro_proveedor_admin);

api.get('/listar_proveedor_admin/:filtro?', authenticate.decodeToken, proveedorController.listar_proveedor_admin);
api.get('/obtener_proveedor_admin/:id', authenticate.decodeToken, proveedorController.obtener_proveedor_admin);
api.put('/actualizar_proveedor_admin/:id', authenticate.decodeToken, proveedorController.actualizar_proveedor_admin);
api.put('/cambiar_estado_proveedor_admin/:id', authenticate.decodeToken, proveedorController.cambiar_estado_proveedor_admin);
api.get('/listar_activos_proveedores_admin', authenticate.decodeToken, proveedorController.listar_activos_proveedores_admin);
module.exports = api;