var Carrito = require('../models/carrito');
var Variedad = require('../models/variedad');
var Direccion = require('../models/direccion');
var Venta = require('../models/venta');
var Venta_detalle = require('../models/venta_detalle');
const nodemailer = require('nodemailer');
var NotaCredito = require('../models/notacredito');


const crear_producto_carrito = async function(req,res){
    if(req.user){
        let data = req.body;

        var variedad = await Variedad.findById({_id:data.variedad}).populate('producto');

        if(data.cantidad <= variedad.stock){
            //
            if(variedad.producto.precio >= 1){
                //
                let carrito = await Carrito.create(data);
                res.status(200).send(carrito);
            }else{
                res.status(200).send({data:undefined,message: 'El producto tiene precio en 0'});
            }
        }else{
            res.status(200).send({data:undefined,message: 'Se supero el stock del producto'});
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_carrito_cliente = async function(req,res){
   
    if(req.user){
       let carrito = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1}).limit(5);
       let carrito_general = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1});

       res.status(200).send({carrito:carrito,carrito_general:carrito_general});
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_carrito_cliente_venta = async function(req,res){
    console.log('obtiene carrito');
     if(req.user){
        let carrito = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1}).limit(5);
        let carrito_general = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1});
 
        res.status(200).send({carrito:carrito,carrito_general:carrito_general});
     }else{
         res.status(500).send({data:undefined,message: 'ErrorToken'});
     }
 }

const eliminar_producto_carrito = async function(req,res){
    if(req.user){
       let id = req.params['id'];
       let reg = await Carrito.findOneAndDelete({_id:id});
       res.status(200).send(reg);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const crear_direccion_cliente = async function(req,res){
    if(req.user){
       let data = req.body;
       data.cliente = req.user.sub;
       let direccion = await Direccion.create(data);
       res.status(200).send(direccion);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obternet_direcciones_cliente = async function(req,res){
    if(req.user){
      
       let direcciones = await Direccion.find({cliente:req.user.sub});
       res.status(200).send(direcciones);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const eliminar_direccion_cliente = async function(req,res){
    if(req.user){
       let id = req.params['id'];
       let direccion = await Direccion.findOneAndDelete({_id:id});
       res.status(200).send(direccion);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const validar_payment_id_venta = async function(req,res){
    
     if(req.user){
        let payment_id = req.params['payment_id'];
        let ventas = await Venta.find({transaccion:payment_id});
        res.status(200).send(ventas);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    } 
}

const crear_venta_cliente = async function(req,res){
    if(req.user){
        let data = req.body;

        console.log('data: ',data);
        
        data.year = new Date().getFullYear();
        data.month = new Date().getMonth()+1;
        data.day = new Date().getDate();
        data.estado = 'Pagado';
        //console.log(data.total);
        

        if(data.total == undefined){
            data.total=100;
           //console.log('total: '+req.body.total);
        }else
        {
            data.total= parseFloat(req.body.total);
        }

        let ventas = await Venta.find().sort({createdAt:-1});

        if(ventas.length == 0){
            data.serie = 1;
        }else{
            data.serie = ventas[0].serie + 1;
        }

        let venta = await Venta.create(data);

        for(var item of data.detalles){

            item.year = new Date().getFullYear();
            item.month = new Date().getMonth()+1;
            item.day = new Date().getDate();
            item.venta = venta._id;

            

              Variedad.updateOne(
                { _id: item.variedad },
                { $inc: { stock: -parseInt(item.cantidad, 10) } }
              )
                .then((resultado) => {
                  console.log('Stock restado con éxito:', resultado);
                })
                .catch((err) => {
                  console.error('Error al restar el stock:', err);
                });  

            await Venta_detalle.create(item);
        
        }

        for(var item of data.notacredito){

            NotaCredito.updateOne(
                { _id: item._id },
                { $inc: { total: -data.total } }
              )
                .then((resultado) => {
                  console.log('nota de credito restado con éxito:', resultado);
                })
                .catch((err) => {
                  console.error('Error al restar el nota de credito:', err);
                });
        
        }

        await Carrito.deleteMany({cliente:data.cliente});

        res.status(200).send(venta);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_informacion_venta = async function(req,res){
   
    if(req.user){
        let id = req.params['id'];
        let venta = await Venta.findById({_id:id}).populate('cliente').populate('direccion');
        let detalles = await Venta_detalle.find({venta:id}).populate('producto').populate('variedad');
        if(req.user.sub == venta.cliente._id){
            res.status(200).send({venta,detalles});
        }else{
            res.status(200).send({data:undefined,message: 'No tienes acceso a esta venta'});
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_ventas_clientes = async function(req,res){
   
    if(req.user){

        let ventas = await Venta.find({cliente:req.user.sub}).populate('cliente').populate('direccion');

            res.status(200).send({ventas});
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_nota_credito = async function(req,res){
   
    if(req.user){
        let data = req.body;

        console.log(data)

        let notacredito = await NotaCredito.find({serie:data.transaccion});

            // Verifica si se encontraron registros
        if (notacredito.length === 0) {
            // No se encontraron registros, envía un mensaje de error
            res.status(404).send({ data:undefined,message: 'Nota de crédito no encontrada' });
        } else {

            // Se encontraron registros, envía la nota de crédito
            if(parseInt(notacredito[0].total, 10) > parseInt(data.total, 10)){
                
                res.status(200).send({ notacredito });
            }else{
                res.status(200).send({ notacredito:null,message: 'Nota de crédito no tiene suficientes fondos' }); 
            }
            
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


module.exports = {
    crear_producto_carrito,
    obtener_carrito_cliente,
    eliminar_producto_carrito,
    crear_direccion_cliente,
    obternet_direcciones_cliente,
    eliminar_direccion_cliente,
    validar_payment_id_venta,
    crear_venta_cliente,
    obtener_informacion_venta,
    obtener_ventas_clientes,
    obtener_carrito_cliente_venta,
    obtener_nota_credito
}