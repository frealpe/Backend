const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const {Usuario,Categoria,Producto}= require('../models');


const coleccionesPermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'producateg',
    'roles'
];

const buscarUsuarios=async(termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json ({results: ( usuario ) ? [ usuario ] : []});
    }
    const regex = new RegExp(termino,'i');  //Insensible a las mayusculas y minusculas

    const usuarios = await Usuario.find({
        $or: [{nombre:regex},{correo:regex}],
        $and: [{estado:true}]        
    });
    return res.json ({results: usuarios });
}  
//////////////////////////////////////////////////////////////////////////////
const buscarCategorias=async(termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json ({results: ( categoria ) ? [ categoria ] : []});
    }
    const regex = new RegExp(termino,'i');  //Insensible a las mayusculas y minusculas

    const categorias = await Categoria.find({nombre:regex,estado:true});
    return res.json ({categorias});
}
/////////////////////////////////////////////////////////////////////////////////
const buscarProductos=async(termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);
    
    if(esMongoID){
        const producto = await Producto.findById(termino);

        return res.json ({results: ( producto ) ? [ producto ] : []});
    }
    const regex = new RegExp(termino,'i');  //Insensible a las mayusculas y minusculas
    
    const productos = await Producto.find({
        $or: [{nombre:regex},{genero:regex},{color:regex},{precio:regex}],
        $and: [{estado:true}],       
    }) .populate('categoria','nombre');

    const total = (productos.length).toString();


    return res.json ({total,productos});
}
/////////////////////////////////////////////////////////////////////////////////
const buscarProduCateg=async(termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const [total,productos] = await Promise.all([
            Producto.countDocuments({categoria:termino}),
            Producto.find({categoria:termino})
            .populate('categoria','nombre')      
        ])               
        return res.json ({total,productos});
    }else{
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////
const buscar = (req,res=response)=>{

    const {coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
        case 'categorias':
            buscarCategorias(termino,res)            
        case 'productos':
            buscarProductos(termino,res)    
        case 'producateg':
            buscarProduCateg(termino,res)    
    
            break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta busqueda'
            })
            
    }

}
//////////////////////////////////////////////////////////////////////////////

module.exports={
    buscar,
    buscarUsuarios,
    buscarCategorias,
    buscarProductos,
    buscarProduCateg
}