const Router = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//Obtener todas los Productos publico
router.get('/', [
   // validarJWT,
    //validarCampos
], obtenerProductos);
//

//Obtener una Producto por id-publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);


//Crear una Producto privado - cualqiuer persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('precio', 'El precio es Obligatorio').not().isEmpty(),  //Tener en cuenta el valor
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);


//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);


//Borrar Producto solo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;