const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid'); // npm i uuid -> generador de IDs
const { updateImg } = require('../helpers/update-img');


/*
    Desde POSTMAN para subir un archivo en la parte de body, en el tab "form-data", se le asigna un KEY, en este caso "image", luego se podra cargar un archivo y ser enviado en la req.
*/
exports.fileUpload = async (req, res = response) => {

    const type = req.params.type;
    const id = req.params.id;

    // Validar types
    const validTypes = ['users', 'hospitals', 'medics'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'It is not an users, a hospitals or a medics',
        });
    }

    // Validar existencia de archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.',
        });
    }

    // Procesar la imagen
    const file = req.files.image; // image es la KEY

    const splitNameFile = file.name.split('.'); // Puede que haya más puntos además del de la extensión, de esta manera, obtengo un array de cada uno de los string que los separaba el punto.
    const fileExtension = splitNameFile[splitNameFile.length - 1]; // Obtengo el último string del array. En este caso la extension "jpg";

    // Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: false,
            msg: 'It is not a valid extension',
        });
    }

    // Generar el nombre del archivo
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Crear path para guardar la imagen
    const uploadPath = `./uploads/${type}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    // const file = req.files.image;
    file.mv(uploadPath, (error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Error moving image.'
            });
        }

        // actualizar base de datos para que el se le asigne la imagen al usuario, medico u hospital que esta generando la request.
        updateImg(type, id, fileName);
        
        res.json({
            ok: true,
            msg: 'File uploaded succesfully.',
            fileName
        });
    });

}

exports.getImage = async (req, res = response) => {

    const type = req.params.type;
    const picture = req.params.picture;

    const imgPath = path.join(__dirname, `../uploads/${type}/${picture}`);

    // imagen por defecto - si el path no existe, se envia una img por defecto
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        const noImgPath = path.join(__dirname, `../uploads/no_image_available.jpg`);
        res.sendFile(noImgPath);
    }

}