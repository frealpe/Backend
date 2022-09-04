const Router = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagenes, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');




const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','categorias','productos'])),
    validarCampos
],actualizarImagenCloudinary);
//actualizarImagen);  //Ruta antigua

router.get('/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','categorias','productos'])),
    validarCampos
],mostrarImagenes)


module.exports = router;