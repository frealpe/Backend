
const { Schema, model } = require('mongoose')

const ProductoSchema = Schema({
///////////////////////////////////////
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
///////////////////////////////////////    
/*     estado: {
        type: Boolean,
        default: true,
        require: true
    }, */
///////////////////////////////////////    
     genero:{
        type:String,
        require:[true,'El genero es obligatorio']     
     },   
///////////////////////////////////////     
     cantidad: {
        type: String,
        default: '0',
        require:[true,'La cantidad es obligatoria']  
    },     
///////////////////////////////////////    
     usuario: {
        type: Schema.Types.ObjectId, //Lo usamos para relacionar los datos de la estación
        ref: 'Usuario', //Nombre de la tabla que se relaciona
        require: true
    }, 
///////////////////////////////////////    
    precio: {
        type: String,
        require:[true,'El precio es obligatorio'],  
        default: '0'
    },
///////////////////////////////////////    
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: {type: String},
    disponible: { type: String, default: '' },
    //TODO grabar 5 imagenes
    img:{
        type:String,
    },

});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema);
