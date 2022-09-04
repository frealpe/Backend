const { response } = require("express");
const { Producto } = require('../models')


//Obtener Productos -paginado -total- populate
//Modifique el populate para no enviar el usuario de nuevo
const obtenerProductos = async (req, res = response) => {

    //TODO recibir numeros no letras
    const { limite = 1000, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
//            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    res.json({
        total,
        productos,
    });
}

//Obtener Producto - por id populate ()

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
 //       .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json({
        producto
    });
}

//Crear una Producto 

const crearProducto = async (req, res = response) => {

    //Se debe sacar lo que no se puede cambiar
    
    const nombre = req.body.nombre.toUpperCase();    


    const { estado, usuario, ...body } = req.body;
    
    const ProductoDB = await Producto.findOne({ nombre});
    
    if (ProductoDB) {
        
        return res.status(400).json({
            msg: `El Producto ${ProductoDB.nombre},ya existe`,
        });
    }

    const data = {

        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,

    }
    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);

}

//Actulizar Producto 

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data,{ new: true });
    res.json(producto);

}

//Borrar Producto -estado: false
const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    //const productoBorrada = await Producto.findByIdAndUpdate(id, { estado: false,disponible:false }, { new: true });  //Si se elimiina ya no esta disponible
    const productoBorrada = await Producto.findOneAndRemove(id);

    res.json(productoBorrada);

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}