const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');
const { fieldsValidation } = require('../middlewares/fields-validation');

const router = Router();
const authController = require('../controllers/auth-controller');


// '/api/login'
router.post('/',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        fieldsValidation
    ], 
    authController.login
);

router.post('/google',
    [
        check('token', 'Google token is required').not().isEmpty(),
        fieldsValidation
    ], 
    authController.googleSignIn
);

router.get('/renew',
    [
        validateJWT,
        fieldsValidation
    ], 
    authController.renewToken
);

module.exports = router;