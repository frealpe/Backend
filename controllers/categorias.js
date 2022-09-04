const { response } = require("express");
const { Categoria } = require('../models')


//Obtener categorias -paginado -total- populate

const obtenerCategorias = async (req, res = response) => {

    //TODO recibir numeros no letras
    const { limite = 50, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
           // .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    res.json({
        total,
        categorias,
    });
}

//Obtener categoria - por id populate ()

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id)
    //.populate('nombre');
    res.json({
        categoria
    });
}

//Crear una categoria 

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre},ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);

}

//Actulizar categoria 

const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    res.json(categoria); 

}

//Borrar categoria -estado: false
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    //const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    const categoriaBorrada = await Categoria.findOneAndRemove(id);

    res.json(categoriaBorrada);

}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}