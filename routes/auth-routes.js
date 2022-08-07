const { Router } = require('express');

const authController = require('../controllers/auth-controller');

const { check } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fields-validation');


const router = Router();

// '/api/login'
router.post('/',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        fieldsValidation
    ], 
    authController.login
);

module.exports = router;