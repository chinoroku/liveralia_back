var NotaCredito = require('../models/notacredito');
var Cliente = require('../models/cliente');
var Venta = require('../models/venta');
const Venta_detalle = require('../models/venta_detalle');

const listar_devolucion_admin = async function(req,res){
    if(req.user){

        //let filtro = req.params['filtro'];

        let notacredito = await NotaCredito.find({}).sort({ createdAt: -1 });
        res.status(200).send(notacredito);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const listar_clientes_devolucion = async function(req,res){
    if(req.user){


        let cliente = await Cliente.find();
        res.status(200).send(cliente);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const listar_ventas_clientes = async function(req,res){
    
    if(req.user){
       let _id = req.params['_id'];
       let ventas = await Venta.find({cliente:_id});
       let venta_detalle = await Venta_detalle.find({_id:ventas._id}).populate('producto').populate('variedad');
       res.status(200).send({ventas:ventas});
   }else{
       res.status(500).send({data:undefined,message: 'ErrorToken'});
   } 
}

const listar_detalle_ventas = async function(req,res){
    
    if(req.user){
       let _id = req.params['_id'];
       let venta_detalle = await Venta_detalle.find({venta:_id}).populate('producto').populate('variedad');
       res.status(200).send({venta_detalle:venta_detalle});
   }else{
       res.status(500).send({data:undefined,message: 'ErrorToken'});
   } 
}


const registro_devolucion_admin = async function(req,res){
    if(req.user){
        let data = req.body;

       console.log(req.body);

    /*    if(productos.length>= 1){
            res.status(200).send({data:undefined,message: 'El titulo del producto ya existe.'});   
        }else{
            var img_path = req.files.portada.path;
            var str_img = img_path.split('\\');
            var str_portada = str_img[2];

            ///

            data.portada = str_portada;
            data.slug = slugify(data.titulo);
            
            try {
                let producto = await Producto.create(data);
                res.status(200).send({data:producto});
            } catch (error) {
                res.status(200).send({ data: undefined, message: 'NO SE PUDO GUARDAR EL PRODUCTO' });
            }
        }*/
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}



module.exports = {
    listar_devolucion_admin,
    listar_clientes_devolucion,
    listar_ventas_clientes,
    listar_detalle_ventas,
    registro_devolucion_admin
}