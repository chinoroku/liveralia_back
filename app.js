var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const {createServer} = require("http");
const {Server} = require("socket.io");

var app = express();

const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: { origin: '*'}
});

io.on('connection',(socket)=>{
    socket.on('send_cart',function(data){
        io.emit('listen_cart',data);
       //console.log(data);
      });
});

var cliente_router = require('./routes/cliente');
var usuario_router = require('./routes/usuario');
var producto_router = require('./routes/producto');
var public_router = require('./routes/public');
var customer_router = require('./routes/customer');
var venta_router = require('./routes/venta');
var proveedor_router = require('./routes/proveedor');

app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

//mongoose.connect('mongodb+srv://angelocaveri:angelo1@cluster0.ukqf3.mongodb.net/bd_liveralia')
mongoose.connect('mongodb+srv://angelocaveri:angelo1@cluster0.ukqf3.mongodb.net/bd_liveralia?retryWrites=true&w=majority')
.then(() => {
    var port = process.env.PORT || 4201;
    httpServer.listen(port, function() {
       //console.log('SERVIDOR CORRIENDO EN EL PUERTO: ' + port);
    })
})
.catch((err) => {
    console.error('ERROR AL CONECTAR A LA BASE DE DATOS: ', err);
})

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_router);
app.use('/api',usuario_router);
app.use('/api',producto_router);
app.use('/api',public_router);
app.use('/api',customer_router);
app.use('/api',venta_router);
app.use('/api',proveedor_router);

module.exports = app;