const { Router } = require('express');
const expressFileUpload = require('express-fileupload'); // npm i express-fileupload -> se utiliza para subir img/archivos al servidor.
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
const uploadsController = require('../controllers/uploads-controller');


router.use(expressFileUpload()); // middleware uploads -> de esta manera la ruta ya es capaz de recibir el archivo cargado.
// '/api/uploads'
router.put('/:type/:id', validateJWT, uploadsController.fileUpload);
router.get('/:type/:picture', uploadsController.getImage);


module.exports = router;


