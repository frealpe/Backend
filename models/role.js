

const {Schema,model} = require('mongoose')
const Schema = mongoose.Schema;

const RoleSchema = Schema({

        rol:{
            type:String,
            require: [true,'El rol es obligatorio']
        }

});

module.exports= mongoose.model('Role',RoleSchema);
