const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto, Categoria } = require('../models');

/////////////////////////////////////////////////////////////////
const cargarArchivo = async (req, res = response) => {
  //console.log(req.files);
  //const carpeta = req.header('Tipo');

  try {
    //imagenes oppr defecto y el path es el mismo
    //const nombre= await subirArchivo(req.files,undefined,'billetera');
    const nombre = await subirArchivo(req.files);
    res.json({
      nombre
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

////////////////////////////////////////////////////////////////

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      print(modelo);
              //.populate('categoria', 'nombre');
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.img) {
    //borrar 
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  print(modelo);
  modelo.img = nombre;
  await modelo.save();

  res.json(modelo);
}

///////////////////////////////////////////////////////////////////////////////
const mostrarImagenes = async(req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
/////////////////////////////////////////    
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
/////////////////////////////////////////
    case 'categorias':
      modelo = await Categoria.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
/////////////////////////////////////////
    case 'productos':
      modelo = await Producto.findById(id)
               .populate('categoria', 'nombre');
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
/////////////////////////////////////////      
    default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.img) {
    //borrar 
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      console.log('Existe');
      return res.sendFile(pathImagen)
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  return res.sendFile(pathImagen);
  
}

////////////////////////////////////////////////////////////////

const actualizarImagenCloudinary = async (req, res = response) => {


  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
/////////////////////////////////////////////////////////    
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
/////////////////////////////////////////////////////////
       case 'categorias':
        modelo = await Categoria.findById(id);
        if (!modelo) {
          return res.status(400).json({ msg: `No existe una categoria con el id ${id}` });
        }
        break; 
/////////////////////////////////////////////////////////
    case 'productos':
      modelo = await Producto.findById(id)
               .populate('categoria', 'nombre');
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length-1];
    const [public_id] =nombre.split('.');
    cloudinary.uploader.destroy(public_id);

  }

  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save(secure_url);

  res.json(modelo);
}
  


module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagenes,
  actualizarImagenCloudinary
}