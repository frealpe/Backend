const path = require('path');
const {v4:uuidv4}=require('uuid');


const subirArchivo = (files,exytensionesValidas=['png','jpg','jpeg','gif'],carpeta='')=>{

    return new Promise((resolve,reject)=>{

        const {archivo} = files;  //Se desestructira la palabra archivo que viene de la req

        const nombreCortado = archivo.name.split('.');

        const extension = nombreCortado[nombreCortado.length-1];
        //Validar una extensión
    
        if(!exytensionesValidas.includes(extension)){
           return reject(`La extensión ${extension} no es permitida,${exytensionesValidas}`);
        }
    
        const nombreTemp= uuidv4()+'.'+extension;  //Ya se pude grabar la misma imagen
        const uploadPath = path.join(__dirname ,'../uploads/',carpeta, nombreTemp);
        //const uploadPath = path.join(__dirname ,'../catalogo/',carpeta, nombreTemp);        

        //const uploadPath = path.join(__dirname ,'../uploads/', archivo.name); //Solo se graba una imagen en el mismo 
    
      
        archivo.mv(uploadPath, (err) =>{
          if (err) {
           reject(err);
          }
      
          resolve(nombreTemp);
        }); 
    

    })

}

module.exports={

    subirArchivo
}