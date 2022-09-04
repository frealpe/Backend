const Router = require('express');
const { check } = require('express-validator');
const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

//Obtener todas las categorias publico
router.get('/', [validarJWT, validarCampos], obtenerCategorias);
//

//Obtener una categoria por id-publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);


//Crear una categoria privado - cualqiuer persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar privado token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

//Borrar categoria solo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], borrarCategoria);

module.exports = router;