
const {Schema,model} = require('mongoose')


const CategoriaSchema = Schema({

        nombre:{
            type:String,
            require: [true,'El nombre es obligatorio'],
            unique:true
        },
///////////////////////////////////////    
        estado:{
            type: Boolean,
            default: true,
            require:true
        },
///////////////////////////////////////    
        img:{
            type:String,
        },    
///////////////////////////////////////                
        usuario:{
            type: Schema.Types.ObjectId, //Lo usamos para relacionar los datos de la estación
            ref:'Usuario', //Nombre de la tabla que se relaciona
            require:true
        }

});

CategoriaSchema.methods.toJSON = function () {
    const { __v,estado,...data } = this.toObject();
    //data.uid=_id;
    return data;
}

module.exports=model('Categoria',CategoriaSchema);
