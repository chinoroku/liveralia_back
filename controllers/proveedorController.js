var Proveedor = require('../models/proveedor');
var Variedad = require('../models/variedad');

const listar_proveedor_admin = async function (req, res) {
    if (req.user) {

        let filtro = req.params['filtro'];

        let proveedores = await Proveedor.find({
            $or: [
                { nombre: new RegExp(filtro, 'i') },
                { email: new RegExp(filtro, 'i') },
                { celular: new RegExp(filtro, 'i') },
            ]
        });
        res.status(200).send(proveedores);
    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
    }
}

const registro_proveedor_admin = async function (req, res) {

    if (req.user) {
        let data = req.body;

        let proveedores = await Proveedor.find({ email: data.email });

        if (proveedores.length >= 1) {
            res.status(200).send({ data: undefined, message: 'El proveedor ya existe' });
        } else {
            let proveedor = await Proveedor.create(data);
            res.status(200).send({ data: proveedor });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
    }
}

const obtener_proveedor_admin = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        try {
            let proveedor = await Proveedor.findById({ _id: id });
            res.status(200).send(proveedor);
        } catch (error) {
            res.status(200).send(undefined);
        }

    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
    }
}
const actualizar_proveedor_admin = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];
        let data = req.body;

        let proveedor = await Proveedor.findByIdAndUpdate({ _id: id }, {
            nombre: data.nombre,
            email: data.email,
            celular: data.celular,
        });

        res.status(200).send(proveedor);

    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
    }
}

const cambiar_estado_proveedor_admin = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado = false;

        if (data.estado) {
            nuevo_estado = false;
        } else {
            nuevo_estado = true;
        }

        let proveedor = await Proveedor.findByIdAndUpdate({ _id: id }, {
            estado: nuevo_estado
        });

        res.status(200).send(proveedor);

    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
    }
}

const listar_activos_proveedores_admin = async function(req,res){
    if(req.user){

        var regs = await Proveedor.find().sort({nombre:1});
        var proveedores = [];

        for(var item of regs){
            var variedades = await Variedad.find({proveedor:item.nombre});
            proveedores.push({
                proveedor: item,
                nvariedades: variedades.length
            });
        }

        res.status(200).send(proveedores);
    
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

module.exports = {
    listar_proveedor_admin,
    registro_proveedor_admin,
    obtener_proveedor_admin,
    actualizar_proveedor_admin,
    cambiar_estado_proveedor_admin,
    listar_activos_proveedores_admin
}