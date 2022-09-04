const { Categoria,Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');


//Si no llega el rol entonces por defecto 'USER_ROLE'
const esRoleVaido = async (rol = 'ADMIN_ROLE') => {
    //Verifcar si existe el rol    
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado`)
    }

}
/////////////////////////////////////////////////////////////////
const emailExiste = async (correo = '') => {
    //Verifcar si existe el correo
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);

    }

}

/////////////////////////////////////////////////////////////////
const existeUsuarioPorId = async (id) => {
    //Verifcar si existe el correo
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);

    }

}
/////////////////////////////////////////////////////////////////
const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id no existe: ${id}`);
    }

}

/////////////////////////////////////////////////////////////////
const existeProductoPorId = async (id) => {
    //Verifcar si existe el correo
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe: ${id}`);

    }   

}

///////////////////////////////////////////////////////////////////

const valida = async (id='') => {
    //Verifcar si existe el correo
        console.log("Salida");
}
///////////////////////////////////////////////////////////////////
//Validar colecciones   
const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida)
    {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;

}
///////////////////////////////////////////////////////////////////

module.exports = {
    esRoleVaido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    valida,
}