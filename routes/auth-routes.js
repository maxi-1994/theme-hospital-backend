const { Router } = require('express');
const { check } = require('express-validator');
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

module.exports = router;