var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'aca';

exports.createToken = function(cliente){
    var payload = {
        sub: cliente._id,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        email: cliente.email,
        genero: cliente.genero,
        iat: moment().unix(),
        exp: moment().add(1,'day').unix()
    }

    return jwt.encode(payload, secret);
}