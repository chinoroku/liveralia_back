var NotaCredito = require('../models/notacredito');
var Cliente = require('../models/cliente');
var Venta = require('../models/venta');
const Venta_detalle = require('../models/venta_detalle');
var Variedad = require('../models/variedad');
const nodemailer = require('nodemailer');

const listar_devolucion_admin = async function (req, res) {
    if (req.user) {

        let filtro = req.params['filtro'];

        let notacredito = await NotaCredito.find({
            $or: [
                { serie: new RegExp(filtro, 'i') },
            ]
        }).populate('cliente');
        res.status(200).send(notacredito);
    } else {
        res.status(500).send({ data: undefined, message: 'ERROR TOKEN' });
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
        var  data = req.body;

       console.log(data);

       for(var item of data.detalleventas){
        for (const [clave, valor] of Object.entries(item.variedad)) {
            if(clave === '_id'){
                Variedad.updateOne(
                    { _id: valor },
                    { $inc: { stock: +parseInt(item.cantidad, 10) } }
                  )
                    .then((resultado) => {
                      console.log('Stock sumado con éxito:', resultado);
                    })
                    .catch((err) => {
                      console.error('Error al restar el stock:', err);
                    });
            }
          }

          
          Venta_detalle.updateOne(
            { _id: item._id },
            { $set: { cantidad: item.cantidad } }
          )
            .then((resultado) => {
              console.log('Venta con éxito:', resultado);
            })
            .catch((err) => {
              console.error('Error al restar el stock:', err);
            });
          
    
    }

    function generarNumeroConLetras() {
        // Generar un número aleatorio de 6 dígitos
        const numero = Math.floor(Math.random() * 900000) + 100000;
      
        // Generar letras aleatorias (puedes ajustar esto según tus necesidades)
        const letrasAleatorias = Math.random().toString(36).substring(2, 8).toUpperCase();
      
        // Combinar el número y las letras
        const numeroConLetras = `${numero}${letrasAleatorias}`;
      
        return numeroConLetras;
      }

      const serie = generarNumeroConLetras().toString(); 

    const nuevaNotaCredito = new NotaCredito({
        serie: serie,
        total: data.Monto,
        estado: true,
        cliente: data.cliente // Reemplaza 'ID_DEL_CLIENTE' con el ID real del cliente
    });

    


    let notacredito = await NotaCredito.create(nuevaNotaCredito);

    
        // Crear un transporter para enviar correos
    const transporter = nodemailer.createTransport({
        // Configuración del servicio de correo electrónico (Gmail en este ejemplo)
        service: 'gmail',
        auth: {
            user: 'angelocaveri@gmail.com',
            pass: 'stdz abew rvyi xgml',
        },
    });

    const emailBody = `
    <p>Estimado cliente : ${data.nombre},</p>
    <p>Le enviamos su nota de crédito con serie: ${serie} y tiene el monto de S/. ${data.Monto}.</p>
    <p>¡Gracias!</p>
`;


         // Configurar opciones del correo
    const mailOptions = {
        from: 'angelocaveri@gmail.com',
        to: data.email, // Reemplaza con la dirección de correo del destinatario
        subject: 'Nota de Credito',
        html: emailBody,
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });



    res.status(200).send(notacredito);
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