const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator -> es un middleware para validaciones.
const { fieldsValidation } = require('../middlewares/fields-validation'); // Custom middleware - validación de campos.
const { validateJWT } = require('../middlewares/validate-jwt'); // Custom middleware - validación de token.

const router = Router();
const usersController = require('../controllers/users-controller');

// '/api/users'
router.get('/', validateJWT, usersController.getUsers);

router.post('/create', 
    [
        check('name', 'Name is required').not().isEmpty(), // Como 2do param se puede pasar el mensaje que muestre cuando haya un error.
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        fieldsValidation,
    ], 
    usersController.createUser
);

router.put('/update/:id', 
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('role', 'Role is required').not().isEmpty(),
        check('email', 'Name is required').isEmail(),
        fieldsValidation,
    ],
    usersController.updateUser
);

router.delete('/delete/:id', validateJWT, usersController.deleteUser);

module.exports = router;