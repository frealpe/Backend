//ESTE CONTROLADOR GESTIONA EL INGRESO, SALIDA, ELIMINACION Y MODIFICACION DE DATOS
//EN LA GESTION DE DATOS AL ENDPOINT  

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');

///////////////////////////////////////////////////////////
const getUsuarioPorId = async(req = request, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findById( id );

    res.json(usuario);
}
///////////////////////////////////////////////////////////
const ususariosGet = async(req=request, res = response) => {

    //TODO recibir numeros no letras
    const{limite=1,desde=0} = req.query; 
    const query={estado:true};
    
    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query) 
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        usuarios
    });
}

///////////////////////////////////////////////////////////
const usuariosPut = async(req, res = response) => {


    const {id} = req.params;
    const {_id,password,google,correo,...resto}= req.body;
    //Validar contra datos de base de datos
    if(password)
    {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto, { new: true } );

    res.json({
        usuario,
    });
}
///////////////////////////////////////////////////////////
const usuariosPost = async (req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt)
    //Guardar en BD
    await usuario.save();

        // Generar el JWT
    const token = await generarJWT( usuario.id );
    res.json({
        usuario,
        token
    });
}
///////////////////////////////////////////////////////////
const usuariosDelete = async (req, res=response) => {
    const {id}= req.params;
    //Se obtiene el usuario autenticado y el borrado
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});
//    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
//        usuarioAutenticado
    });
}
///////////////////////////////////////////////////////////
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}
///////////////////////////////////////////////////////////
module.exports = {
    ususariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete,
    getUsuarioPorId
}